import os
import io
import random
from pathlib import Path

import PyPDF2
import anthropic

ARCHIVE_PATH = Path(os.getenv("ARCHIVE_PATH", "../archive"))
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        return text[:8000]  # Limit to avoid token overflow
    except Exception:
        return ""


def get_random_cv_from_dataset(category: str) -> tuple[str, str]:
    """Returns (filename, text) of a random CV from the dataset."""
    cat_dir = ARCHIVE_PATH / "data" / "data" / category.upper()
    if not cat_dir.exists():
        cat_dir = ARCHIVE_PATH / "data" / "data" / "ENGINEERING"

    pdf_files = list(cat_dir.glob("*.pdf"))
    if not pdf_files:
        return "", ""

    chosen = random.choice(pdf_files)
    try:
        text = extract_text_from_pdf(chosen.read_bytes())
        return chosen.name, text
    except Exception:
        return chosen.name, ""


def get_cv_from_csv(category: str = None) -> dict:
    """Get a random CV record from the CSV dataset."""
    import csv
    csv_path = ARCHIVE_PATH / "Resume" / "Resume.csv"
    if not csv_path.exists():
        return {}

    records = []
    with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if category and row.get("Category", "").upper() != category.upper():
                continue
            records.append(row)
            if len(records) > 500:  # Sample from first 500 matching
                break

    if not records:
        return {}

    record = random.choice(records)
    return {
        "id": record.get("ID", ""),
        "text": record.get("Resume_str", "")[:6000],
        "category": record.get("Category", ""),
    }


async def parse_cv_with_ai(cv_text: str, jd_text: str = "", category: str = "") -> dict:
    """Use Claude to parse and analyze a CV."""
    if not cv_text.strip():
        return _empty_result(category)

    prompt = f"""Analyze the following resume/CV and extract structured information.

CV TEXT:
{cv_text}

{f'JOB DESCRIPTION TO MATCH AGAINST:\n{jd_text[:2000]}' if jd_text else ''}

Return a JSON object with these exact fields:
{{
  "name": "Full name or 'Unknown'",
  "email": "email or 'N/A'",
  "phone": "phone or 'N/A'",
  "location": "city/country or 'N/A'",
  "experience": <number of years as integer>,
  "education": "highest degree and school",
  "skills": ["skill1", "skill2", ...],
  "certifications": ["cert1", ...],
  "summary": "2-3 sentence professional summary",
  "category": "{category or 'General'}",
  "matchingScore": <integer 0-100 if JD provided, else null>,
  "matchingReason": "explanation if JD provided, else null"
}}

Return ONLY the JSON object, no other text."""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        import json
        text = message.content[0].text.strip()
        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        return _empty_result(category)


def _empty_result(category: str) -> dict:
    return {
        "name": "Unknown Candidate",
        "email": "unknown@email.com",
        "phone": "N/A",
        "location": "N/A",
        "experience": 0,
        "education": "Not specified",
        "skills": [],
        "certifications": [],
        "summary": "Unable to parse CV. Please check the file format.",
        "category": category,
        "matchingScore": None,
        "matchingReason": None,
    }
