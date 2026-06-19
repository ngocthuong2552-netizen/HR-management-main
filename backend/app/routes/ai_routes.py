from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import chat_with_ai, generate_jd, generate_interview_questions, evaluate_candidate
from app.services.cv_service import extract_text_from_pdf, parse_cv_with_ai, get_cv_from_csv, get_random_cv_from_dataset

router = APIRouter(prefix="/api/ai", tags=["AI"])


class ChatRequest(BaseModel):
    message: str
    history: list = []


class JDRequest(BaseModel):
    title: str
    department: str = "Engineering"
    type: str = "full-time"
    experience: str = "3-5 năm"
    salary: str = ""
    location: str = "TP.HCM"
    remote: str = "hybrid"
    keySkills: str = ""
    responsibilities: str = ""
    companyName: str = "TechCorp Vietnam"


class InterviewRequest(BaseModel):
    position: str = ""
    level: str = "mid"
    type: str = "hr"


class EvaluateRequest(BaseModel):
    notes: str
    position: str = ""


@router.post("/chat")
async def chat(req: ChatRequest):
    reply = await chat_with_ai(req.message, req.history)
    return {"reply": reply}


@router.post("/parse-cv")
async def parse_cv(
    file: UploadFile = File(...),
    jd_text: Optional[str] = Form(default=""),
):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(400, "Chỉ hỗ trợ PDF và DOCX")

    content = await file.read()
    if file.filename.endswith('.pdf'):
        cv_text = extract_text_from_pdf(content)
    else:
        cv_text = content.decode('utf-8', errors='ignore')[:8000]

    result = await parse_cv_with_ai(cv_text, jd_text or "")
    return result


@router.get("/parse-sample")
async def parse_sample(category: str = "ENGINEERING"):
    # Try PDF first
    filename, cv_text = get_random_cv_from_dataset(category)

    # Fallback to CSV
    if not cv_text:
        record = get_cv_from_csv(category)
        cv_text = record.get("text", "")
        filename = f"CSV_{record.get('id', 'sample')}.txt"

    if not cv_text:
        raise HTTPException(404, f"No samples found for category: {category}")

    result = await parse_cv_with_ai(cv_text, category=category)
    result["source_file"] = filename
    return result


@router.post("/generate-jd")
async def gen_jd(req: JDRequest):
    jd = await generate_jd(req.model_dump())
    return {"jd": jd}


@router.post("/interview-questions")
async def interview_qs(req: InterviewRequest):
    questions = await generate_interview_questions(req.position, req.level, req.type)
    return {"questions": questions}


@router.post("/evaluate-candidate")
async def eval_candidate(req: EvaluateRequest):
    evaluation = await evaluate_candidate(req.notes, req.position)
    return {"evaluation": evaluation}


@router.get("/categories")
async def list_categories():
    """List available CV categories from dataset."""
    from pathlib import Path
    import os
    archive_path = Path(os.getenv("ARCHIVE_PATH", "../archive")) / "data" / "data"
    if archive_path.exists():
        cats = [d.name for d in archive_path.iterdir() if d.is_dir()]
        return {"categories": sorted(cats)}
    return {"categories": []}
