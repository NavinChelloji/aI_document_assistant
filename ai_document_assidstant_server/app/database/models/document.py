import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, func, BigInteger, Text
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    storage_path = Column(Text, nullable=False)
    upload_status = Column(String(20), default='processing', index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
