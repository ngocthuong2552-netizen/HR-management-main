import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from app.database import init_db, get_db, CandidateDB
from app.dependencies import get_current_user
from app.routes.ai_routes import router as ai_router
from app.routes.candidate_routes import router as candidate_router
from app.routes.email_routes import router as email_router
from app.routes.auth_routes import router as auth_router

app = FastAPI(
    title="HR Management API",
    description="AI-Powered HR Management System Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://hr-management-main-tau.vercel.app",
    ],
    allow_origin_regex=r"https://hr-management-main-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)
app.include_router(candidate_router)
app.include_router(email_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup():
    init_db()
    print("✅ Database initialized")
    print(f"📂 Archive path: {os.getenv('ARCHIVE_PATH', '../archive')}")


@app.get("/")
async def root():
    return {"message": "HR Management API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/analytics/overview")
async def analytics_overview(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    total_candidates = db.query(CandidateDB).count()
    hired = db.query(CandidateDB).filter(CandidateDB.stage == "hired").count()
    return {
        "totalPositions": 12,
        "totalCandidates": total_candidates,
        "hired": hired,
        "timeToHire": 28,
        "timeToFill": 45,
        "offerAcceptanceRate": 84,
        "interviewToHireRatio": 4.2,
    }