from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class ChatSessionCreate(BaseModel):
    title: str
    workspace_id: UUID

class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    workspace_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    question: str

class ChatMessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    question: str
    answer: str
    model: Optional[str]
    token_usage: Optional[int]
    response_time_ms: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
