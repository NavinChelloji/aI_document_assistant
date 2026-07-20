from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatSessionCreate(BaseModel):
    title: str
    workspace_id: int

class ChatSessionResponse(BaseModel):
    id: int
    title: str
    workspace_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
