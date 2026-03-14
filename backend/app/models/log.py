from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Log(Base):
    __tablename__ = "logs"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, nullable=False)
    content    = Column(Text, nullable=False)
    snippet    = Column(Text, default="")
    language   = Column(String, default="")
    tags       = Column(String, default="")  # comma-separated e.g. "react,python"
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)

    author     = relationship("User", back_populates="logs")
