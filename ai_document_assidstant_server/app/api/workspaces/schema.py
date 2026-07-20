from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
