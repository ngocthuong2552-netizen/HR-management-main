from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import date

from app.database import get_db, CandidateDB

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])


class CandidateCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    position: str
    department: str = "Engineering"
    experience: int = 0
    education: str = ""
    skills: List[str] = []
    source: str = "website"
    location: str = "TP.HCM"
    notes: str = ""
    expected_salary: Optional[int] = None


class CandidateUpdate(BaseModel):
    stage: Optional[str] = None
    notes: Optional[str] = None
    matching_score: Optional[float] = None
    talent_pool: Optional[bool] = None


@router.get("/")
def list_candidates(
    stage: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(CandidateDB)
    if stage:
        query = query.filter(CandidateDB.stage == stage)
    if search:
        query = query.filter(
            (CandidateDB.name.ilike(f"%{search}%")) |
            (CandidateDB.position.ilike(f"%{search}%"))
        )
    return query.limit(limit).all()


@router.post("/")
def create_candidate(data: CandidateCreate, db: Session = Depends(get_db)):
    candidate = CandidateDB(
        id=str(uuid.uuid4()),
        applied_date=str(date.today()),
        **data.model_dump()
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/{candidate_id}")
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")
    return c


@router.patch("/{candidate_id}")
def update_candidate(candidate_id: str, data: CandidateUpdate, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(c, k, v)
    db.commit()
    return c


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: str, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")
    db.delete(c)
    db.commit()
    return {"ok": True}


@router.get("/stats/pipeline")
def pipeline_stats(db: Session = Depends(get_db)):
    stages = ['applied', 'cv_screening', 'hr_interview', 'technical_interview',
              'manager_interview', 'offer', 'hired', 'rejected']
    return {s: db.query(CandidateDB).filter(CandidateDB.stage == s).count() for s in stages}
