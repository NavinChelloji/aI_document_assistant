from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class DocumentResponse(BaseModel):
    id: UUID
    file_name: str
    file_type: str
    file_size: int
    workspace_id: UUID
    storage_path: str
    upload_status: str
    created_at: datetime

    class Config:
        from_attributes = True
