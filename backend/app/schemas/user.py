from pydantic import BaseModel, EmailStr
from typing import Optional
from typing import Optional
from datetime import datetime

# --- Register ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# --- Login ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- What we return to the client (never expose password) ---
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    bio: str
    avatar_url: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- JWT Token response ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
