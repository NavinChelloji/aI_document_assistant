from pydantic import BaseModel
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    content_type: str
    size_bytes: int
    workspace_id: int
    created_at: datetime

    class Config:
        from_attributes = True
