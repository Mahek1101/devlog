from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.log import Log
from app.models.follow import Follow
from app.utils.auth import get_current_user

router = APIRouter(prefix="/feed", tags=["Feed"])

@router.get("/")
def get_feed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all users current user follows
    followed = db.query(Follow.followed_id).filter(
        Follow.follower_id == current_user.id
    ).subquery()

    # Get their logs
    logs = db.query(Log).filter(
        Log.user_id.in_(followed)
    ).order_by(Log.created_at.desc()).limit(50).all()

    result = []
    for l in logs:
        author = db.query(User).filter(User.id == l.user_id).first()
        result.append({
            "id": l.id,
            "title": l.title,
            "content": l.content,
            "snippet": l.snippet or "",
            "language": l.language or "",
            "tags": l.tags or "",
            "created_at": l.created_at,
            "user_id": l.user_id,
            "author_username": author.username if author else "unknown"
        })
    return result
