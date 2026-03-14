from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.log import Log
from app.models.follow import Follow
from app.utils.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users"])

class ProfileOut(BaseModel):
    id: int
    username: str
    bio: str
    created_at: datetime
    total_logs: int
    followers: int
    following: int
    is_following: bool

    class Config:
        from_attributes = True

class UserSearchOut(BaseModel):
    id: int
    username: str
    bio: str
    total_logs: int

# Get a user's public profile
@router.get("/{username}", response_model=ProfileOut)
def get_profile(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total_logs = db.query(Log).filter(Log.user_id == user.id).count()
    followers  = db.query(Follow).filter(Follow.followed_id == user.id).count()
    following  = db.query(Follow).filter(Follow.follower_id == user.id).count()
    is_following = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user.id
    ).first() is not None

    return {
        "id": user.id,
        "username": user.username,
        "bio": user.bio or "",
        "created_at": user.created_at,
        "total_logs": total_logs,
        "followers": followers,
        "following": following,
        "is_following": is_following
    }

# Get a user's public logs
@router.get("/{username}/logs")
def get_user_logs(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    logs = db.query(Log).filter(Log.user_id == user.id).order_by(Log.created_at.desc()).all()
    return [{
        "id": l.id,
        "title": l.title,
        "content": l.content,
        "snippet": l.snippet or "",
        "language": l.language or "",
        "tags": l.tags or "",
        "created_at": l.created_at,
        "user_id": l.user_id,
        "author_username": user.username
    } for l in logs]

# Follow a user
@router.post("/{username}/follow")
def follow_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user.id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already following")

    follow = Follow(follower_id=current_user.id, followed_id=user.id)
    db.add(follow)
    db.commit()
    return {"message": f"Now following {username}"}

# Unfollow a user
@router.delete("/{username}/follow")
def unfollow_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == user.id
    ).first()

    if not follow:
        raise HTTPException(status_code=400, detail="Not following")

    db.delete(follow)
    db.commit()
    return {"message": f"Unfollowed {username}"}

# Search users
@router.get("/search/users")
def search_users(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).filter(User.username.ilike(f"%{q}%")).limit(10).all()
    return [{
        "id": u.id,
        "username": u.username,
        "bio": u.bio or "",
        "total_logs": db.query(Log).filter(Log.user_id == u.id).count()
    } for u in users if u.id != current_user.id]
