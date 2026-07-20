from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.database.models.chat import ChatSession
from app.database.models.message import ChatMessage
from app.api.workspaces.service import get_workspace
from app.api.chat.schema import ChatSessionCreate, ChatMessageCreate
from app.ai.llm.ollama import get_llm
from app.ai.vector_db.chroma import get_chroma_client
from app.ai.embeddings.embedding_service import get_embedding_model

async def create_chat_session(db: AsyncSession, session_in: ChatSessionCreate, user_id: int) -> ChatSession:
    # Ensure user owns workspace
    await get_workspace(db, session_in.workspace_id, user_id)
    
    db_session = ChatSession(title=session_in.title, workspace_id=session_in.workspace_id)
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

async def get_chat_sessions(db: AsyncSession, workspace_id: int, user_id: int) -> List[ChatSession]:
    await get_workspace(db, workspace_id, user_id)
    result = await db.execute(select(ChatSession).where(ChatSession.workspace_id == workspace_id))
    return result.scalars().all()

async def append_message_to_session(db: AsyncSession, session_id: int, message_in: ChatMessageCreate, user_id: int) -> ChatMessage:
    # Verify session exists and user owns the workspace
    result = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")
        
    await get_workspace(db, session.workspace_id, user_id)
    
    # Save user message
    user_msg = ChatMessage(session_id=session_id, role="user", content=message_in.content)
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)
    
    # --- RAG Integration ---
    # 1. Embed user query
    embeddings_model = get_embedding_model()
    query_embedding = embeddings_model.embed_query(message_in.content)
    
    # 2. Retrieve relevant chunks from ChromaDB for this workspace_id
    chroma_client = get_chroma_client()
    try:
        collection = chroma_client.get_collection(name="workspace_documents")
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3,
            where={"workspace_id": session.workspace_id}
        )
        # Extract text from results
        context_chunks = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            context_chunks = results["documents"][0]
        context_text = "\n\n".join(context_chunks)
    except Exception as e:
        print(f"Error querying ChromaDB: {e}")
        context_text = ""
        
    # 3. Construct prompt with context
    if context_text:
        augmented_prompt = (
            f"Use the following context to answer the user's question.\n"
            f"Context:\n{context_text}\n\n"
            f"Question: {message_in.content}"
        )
    else:
        augmented_prompt = message_in.content
    # -----------------------------------
    
    llm = get_llm()
    try:
        response_text = llm.invoke(augmented_prompt)
    except Exception as e:
        print(f"Error calling LLM: {e}")
        response_text = "Sorry, I am currently unable to reach the AI model."
    
    # Save AI message
    ai_msg = ChatMessage(session_id=session_id, role="ai", content=response_text)
    db.add(ai_msg)
    await db.commit()
    await db.refresh(ai_msg)
    
    return ai_msg

async def get_session_messages(db: AsyncSession, session_id: int, user_id: int) -> List[ChatMessage]:
    result = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")
        
    await get_workspace(db, session.workspace_id, user_id)
    
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    return result.scalars().all()
