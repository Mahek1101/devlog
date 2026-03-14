from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models
from app.routers.auth import router as auth_router
from app.routers.logs import router as logs_router
from app.routers.users import router as users_router
from app.routers.feed import router as feed_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevLog API",
    description="Backend API for the DevLog developer journal app",
    version="0.5.0"
)

origins = [
    "http://localhost:3000",
    "https://devlog-frontend.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(logs_router)
app.include_router(users_router)
app.include_router(feed_router)

@app.get("/")
def root():
    return {"message": "DevLog API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
