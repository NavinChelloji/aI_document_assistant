from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Text
from app.database.base import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False) # e.g., "user" or "ai"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
