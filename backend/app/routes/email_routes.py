import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, CandidateDB, EmailLogDB
from app.services import email_service

router = APIRouter(prefix="/api/candidates", tags=["Emails"])


class SendEmailRequest(BaseModel):
    template: str = "custom"          # interview_invite | rejection | offer | custom
    subject: Optional[str] = None     # required if template == custom
    body: Optional[str] = None        # required if template == custom
    interview_type: Optional[str] = None
    interview_time: Optional[str] = None
    interview_location: Optional[str] = None
    salary: Optional[str] = None
    start_date: Optional[str] = None


class PreviewEmailRequest(BaseModel):
    template: str
    interview_type: Optional[str] = None
    interview_time: Optional[str] = None
    interview_location: Optional[str] = None
    salary: Optional[str] = None
    start_date: Optional[str] = None


@router.get("/email-templates")
def get_templates():
    return {"templates": email_service.list_templates()}


@router.post("/{candidate_id}/emails/preview")
def preview_email(candidate_id: str, req: PreviewEmailRequest, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")

    candidate_dict = {"name": c.name, "position": c.position, "department": c.department}
    extra = req.model_dump(exclude={"template"}, exclude_none=True)
    try:
        rendered = email_service.render_template(req.template, candidate_dict, extra)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return rendered


@router.post("/{candidate_id}/emails")
def send_email_to_candidate(candidate_id: str, req: SendEmailRequest, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")

    if req.template == "custom":
        if not req.subject or not req.body:
            raise HTTPException(400, "subject và body bắt buộc khi dùng template 'custom'")
        subject, body = req.subject, req.body
    else:
        candidate_dict = {"name": c.name, "position": c.position, "department": c.department}
        extra = req.model_dump(exclude={"template", "subject", "body"}, exclude_none=True)
        try:
            rendered = email_service.render_template(req.template, candidate_dict, extra)
        except ValueError as e:
            raise HTTPException(400, str(e))
        subject, body = req.subject or rendered["subject"], req.body or rendered["body"]

    result = email_service.send_email(c.email, subject, body)

    log = EmailLogDB(
        id=str(uuid.uuid4()),
        candidate_id=candidate_id,
        candidate_email=c.email,
        template=req.template,
        subject=subject,
        body=body,
        status=result["status"],
        created_at=datetime.utcnow(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/{candidate_id}/emails")
def get_email_history(candidate_id: str, db: Session = Depends(get_db)):
    c = db.query(CandidateDB).filter(CandidateDB.id == candidate_id).first()
    if not c:
        raise HTTPException(404, "Candidate not found")
    logs = (
        db.query(EmailLogDB)
        .filter(EmailLogDB.candidate_id == candidate_id)
        .order_by(EmailLogDB.created_at.desc())
        .all()
    )
    return logs