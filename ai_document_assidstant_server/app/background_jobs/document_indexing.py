import os
from app.config.settings import get_settings
from app.document_processing.parser.pdf_parser import extract_text_from_pdf
from app.ai.rag.chunker import chunk_text
from app.ai.embeddings.embedding_service import get_embedding_model
from app.ai.vector_db.chroma import get_chroma_client

settings = get_settings()

def index_document_task(document_id: int, workspace_id: int, relative_file_path: str):
    """
    Background task to parse a document, chunk it, generate embeddings,
    and store it in ChromaDB under a collection specific to the workspace.
    """
    full_path = os.path.join(settings.UPLOAD_DIR, relative_file_path)
    
    if not os.path.exists(full_path):
        print(f"File not found for indexing: {full_path}")
        return

    # 1. Parse Document
    # We are supporting PDF for now based on the parser.
    # Expand here for docx, txt, etc. based on content_type in future.
    if full_path.lower().endswith(".pdf"):
        text = extract_text_from_pdf(full_path)
    else:
        # Fallback to plain text read
        try:
            with open(full_path, "r", encoding="utf-8") as f:
                text = f.read()
        except Exception as e:
            print(f"Error reading non-pdf file: {e}")
            text = ""

    if not text.strip():
        print(f"No text extracted for document {document_id}")
        return

    # 2. Chunk Document
    chunks = chunk_text(text)
    
    if not chunks:
        return

    # 3 & 4. Embed and Store in ChromaDB
    # We use workspace_id to isolate collections or filter.
    # Here we use a single collection but filter by workspace_id metadata.
    try:
        chroma_client = get_chroma_client()
        collection = chroma_client.get_or_create_collection(name="workspace_documents")
        
        embeddings_model = get_embedding_model()
        
        # We can either let ChromaDB handle embedding internally (if we configured it with an embedding function)
        # OR we generate them manually via LangChain and pass them in. 
        # Since we use LangChain's HuggingFaceEmbeddings, let's embed manually:
        
        embedded_docs = embeddings_model.embed_documents(chunks)
        
        ids = [f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"workspace_id": workspace_id, "document_id": document_id} for _ in chunks]
        
        collection.add(
            ids=ids,
            embeddings=embedded_docs,
            documents=chunks,
            metadatas=metadatas
        )
        
        print(f"Successfully indexed document {document_id}")
    except Exception as e:
        print(f"Error during embedding and storage for document {document_id}: {e}")
