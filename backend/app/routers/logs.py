from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.log import Log
from app.models.user import User
from app.schemas.log import LogCreate, LogUpdate, LogOut
from app.utils.auth import get_current_user

router = APIRouter(prefix="/logs", tags=["Logs"])

def log_to_out(log: Log, username: str) -> dict:
    return {
        "id": log.id,
        "title": log.title,
        "content": log.content,
        "snippet": log.snippet or "",
        "language": log.language or "",
        "tags": log.tags or "",
        "created_at": log.created_at,
        "user_id": log.user_id,
        "author_username": username
    }

# Create a new log
@router.post("/", response_model=LogOut, status_code=201)
def create_log(
    payload: LogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = Log(
        title=payload.title,
        content=payload.content,
        snippet=payload.snippet or "",
        language=payload.language or "",
        tags=payload.tags or "",
        user_id=current_user.id
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log_to_out(log, current_user.username)

# Get all logs for current user
@router.get("/mine", response_model=List[LogOut])
def get_my_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(Log).filter(Log.user_id == current_user.id).order_by(Log.created_at.desc()).all()
    return [log_to_out(l, current_user.username) for l in logs]

# Get a single log by id
@router.get("/{log_id}", response_model=LogOut)
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(Log).filter(Log.id == log_id, Log.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log_to_out(log, current_user.username)

# Update a log
@router.put("/{log_id}", response_model=LogOut)
def update_log(
    log_id: int,
    payload: LogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(Log).filter(Log.id == log_id, Log.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(log, field, value)
    db.commit()
    db.refresh(log)
    return log_to_out(log, current_user.username)

# Delete a log
@router.delete("/{log_id}", status_code=204)
def delete_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(Log).filter(Log.id == log_id, Log.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
