from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class LogCreate(BaseModel):
    title: str
    content: str
    snippet: Optional[str] = ""
    language: Optional[str] = ""
    tags: Optional[str] = ""

class LogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    snippet: Optional[str] = None
    language: Optional[str] = None
    tags: Optional[str] = None

class LogOut(BaseModel):
    id: int
    title: str
    content: str
    snippet: str
    language: str
    tags: str
    created_at: datetime
    user_id: int
    author_username: Optional[str] = None

    class Config:
        from_attributes = True
