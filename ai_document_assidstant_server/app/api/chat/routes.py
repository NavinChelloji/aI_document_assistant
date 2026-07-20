from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.chat.schema import ChatSessionCreate, ChatSessionResponse, ChatMessageCreate, ChatMessageResponse
from app.api.chat.service import create_chat_session, get_chat_sessions, append_message_to_session, get_session_messages
from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user

router = APIRouter()

@router.post("/session", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_in: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await create_chat_session(db, session_in, current_user.id)

@router.get("/workspace/{workspace_id}/sessions", response_model=List[ChatSessionResponse])
async def list_sessions(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_chat_sessions(db, workspace_id, current_user.id)

@router.post("/{session_id}/message", response_model=ChatMessageResponse)
async def send_message(
    session_id: int,
    message_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    # This will save user msg, call LLM, and return the AI msg
    return await append_message_to_session(db, session_id, message_in, current_user.id)

@router.get("/{session_id}/messages", response_model=List[ChatMessageResponse])
async def list_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    return await get_session_messages(db, session_id, current_user.id)
