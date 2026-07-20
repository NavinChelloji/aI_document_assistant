import uuid
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
