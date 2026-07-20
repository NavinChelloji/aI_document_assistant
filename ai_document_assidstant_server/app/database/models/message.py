import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Text
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id"), index=True, nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    model = Column(String(100), nullable=True)
    token_usage = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
