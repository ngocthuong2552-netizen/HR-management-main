import os
import json

AI_PROVIDER = os.getenv("AI_PROVIDER", "claude").lower()

HR_SYSTEM_PROMPT = """Bạn là HR AI Assistant của một công ty công nghệ Việt Nam.
Bạn hỗ trợ nhân viên và ứng viên giải đáp các câu hỏi về:
- Quy trình tuyển dụng: Applied → CV Screening → HR Interview → Technical → Manager → Offer → Hired
- Chính sách nghỉ phép: 12 ngày/năm (tăng theo thâm niên, tối đa 18 ngày)
- Phúc lợi: Bảo hiểm sức khỏe Bảo Việt, thưởng tháng 13, review lương 2 lần/năm
- Chương trình đào tạo: Onboarding, Technical, Soft Skills, Leadership (LMS)
- Các vị trí đang tuyển: Frontend, Backend, Data Scientist, DevOps, PM, Marketing

Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp. Dùng emoji vừa phải.
Nếu không có thông tin, hướng dẫn liên hệ HR: hr@company.vn"""


# ── Claude ──────────────────────────────────────────────
def _claude_client():
    import anthropic
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


def _call_claude(messages: list, system: str = "", max_tokens: int = 1024) -> str:
    client = _claude_client()
    kwargs = dict(
        model="claude-haiku-4-5-20251001",
        max_tokens=max_tokens,
        messages=messages,
    )
    if system:
        kwargs["system"] = system
    resp = client.messages.create(**kwargs)
    return resp.content[0].text


# ── Gemini ───────────────────────────────────────────────
def _call_gemini(messages: list, system: str = "", max_tokens: int = 1024) -> str:
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
    # Build contents
    contents = []
    for m in messages:
        role = "user" if m["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=m["content"])]))
    config = types.GenerateContentConfig(
        system_instruction=system or None,
        max_output_tokens=max_tokens,
    )
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
        config=config,
    )
    return resp.text


# ── OpenAI ───────────────────────────────────────────────
def _call_openai(messages: list, system: str = "", max_tokens: int = 1024) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
    full_messages = []
    if system:
        full_messages.append({"role": "system", "content": system})
    full_messages.extend(messages)
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=full_messages,
        max_tokens=max_tokens,
    )
    return resp.choices[0].message.content


# ── Unified caller ───────────────────────────────────────
def _call_ai(messages: list, system: str = "", max_tokens: int = 1024) -> str:
    try:
        if AI_PROVIDER == "gemini":
            return _call_gemini(messages, system, max_tokens)
        elif AI_PROVIDER == "openai":
            return _call_openai(messages, system, max_tokens)
        else:
            return _call_claude(messages, system, max_tokens)
    except Exception as e:
        raise RuntimeError(f"[{AI_PROVIDER}] AI call failed: {e}") from e


# ── Public API ───────────────────────────────────────────
async def chat_with_ai(message: str, history: list) -> str:
    messages = [{"role": h["role"], "content": h["content"]} for h in history[-10:]]
    messages.append({"role": "user", "content": message})
    try:
        return _call_ai(messages, system=HR_SYSTEM_PROMPT)
    except Exception as e:
        return f"Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại hoặc liên hệ HR: hr@company.vn\n\nLỗi: {e}"


async def generate_jd(form: dict) -> str:
    prompt = f"""Tạo một Job Description chuyên nghiệp, hấp dẫn bằng tiếng Việt với thông tin sau:

Vị trí: {form.get('title', 'N/A')}
Phòng ban: {form.get('department', 'Engineering')}
Loại: {form.get('type', 'full-time')}
Kinh nghiệm: {form.get('experience', '3-5 năm')}
Lương: {form.get('salary', 'Thỏa thuận')}
Địa điểm: {form.get('location', 'TP.HCM')} ({form.get('remote', 'hybrid')})
Công ty: {form.get('companyName', 'TechCorp Vietnam')}
Kỹ năng cần: {form.get('keySkills', '')}
Trách nhiệm thêm: {form.get('responsibilities', '')}

Viết JD đầy đủ gồm: Giới thiệu công ty, Mô tả công việc, Yêu cầu (bắt buộc & điểm cộng),
Quyền lợi (lương, bảo hiểm, đào tạo, culture), Quy trình tuyển dụng, Cách nộp hồ sơ.
Format đẹp, dùng emoji phù hợp, tone chuyên nghiệp nhưng thân thiện."""
    try:
        return _call_ai([{"role": "user", "content": prompt}], max_tokens=2048)
    except Exception as e:
        return f"Không thể tạo JD: {e}"


async def generate_interview_questions(position: str, level: str, interview_type: str) -> list:
    type_labels = {"hr": "HR/Culture Fit", "technical": "Technical Skills", "manager": "Manager/Behavioral"}
    prompt = f"""Tạo 5 câu hỏi phỏng vấn cho:
- Vị trí: {position or 'Software Developer'}
- Cấp độ: {level}
- Vòng: {type_labels.get(interview_type, 'HR')}

Trả về JSON array với format:
[{{
  "category": "tên nhóm câu hỏi",
  "question": "câu hỏi chính",
  "followUp": "câu hỏi tiếp theo (có thể null)",
  "tip": "gợi ý cho interviewer",
  "difficulty": "easy|medium|hard"
}}]

Câu hỏi bằng tiếng Việt, thực tế và có chiều sâu. Chỉ trả về JSON array."""
    try:
        text = _call_ai([{"role": "user", "content": prompt}])
        text = text.strip()
        if text.startswith("```"):
            text = "\n".join(text.split("\n")[1:-1])
        return json.loads(text)
    except Exception:
        return []


async def evaluate_candidate(notes: str, position: str) -> str:
    prompt = f"""Dựa trên ghi chú phỏng vấn sau đây cho vị trí "{position or 'Developer'}",
hãy đưa ra đánh giá chuyên nghiệp bằng tiếng Việt:

GHI CHÚ:
{notes}

Đánh giá bao gồm:
1. Điểm tổng thể (X/10)
2. Điểm mạnh (bullet points)
3. Điểm cần cân nhắc
4. Đề xuất: Tiếp tục hay Dừng lại
5. Gợi ý cho vòng tiếp theo (nếu tiếp tục)"""
    try:
        return _call_ai([{"role": "user", "content": prompt}], max_tokens=800)
    except Exception as e:
        return f"Không thể đánh giá: {e}"
