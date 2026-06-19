"""
Email templating + (simulated) sending service.

NOTE: Sending is currently SIMULATED — every "sent" email is written to the
email_logs table so the UI has full history, but no real SMTP call is made
yet. To wire up real sending later, implement `_send_via_smtp()` below and
call it from `send_email()`.
"""
import os
from datetime import datetime

COMPANY_NAME = os.getenv("COMPANY_NAME", "TechCorp Vietnam")
HR_SENDER_NAME = os.getenv("HR_SENDER_NAME", "Phòng Nhân sự")
HR_SENDER_EMAIL = os.getenv("HR_SENDER_EMAIL", "hr@techcorp.vn")


def _fmt_date(d: str = None) -> str:
    return d or datetime.now().strftime("%d/%m/%Y")


TEMPLATES = {
    "interview_invite": {
        "label": "Mời phỏng vấn",
        "subject": "Thư mời phỏng vấn vị trí {position} tại {company}",
        "body": (
            "Kính gửi {name},\n\n"
            "Cảm ơn bạn đã ứng tuyển vị trí {position} tại {company}.\n\n"
            "Chúng tôi rất ấn tượng với hồ sơ của bạn và trân trọng mời bạn tham gia buổi phỏng vấn "
            "với thông tin chi tiết như sau:\n\n"
            "  • Vị trí: {position}\n"
            "  • Hình thức: {interview_type}\n"
            "  • Thời gian: {interview_time}\n"
            "  • Địa điểm: {interview_location}\n\n"
            "Vui lòng phản hồi email này để xác nhận thời gian tham dự, hoặc đề xuất thời gian khác "
            "phù hợp hơn nếu cần.\n\n"
            "Trân trọng,\n{sender_name}\n{company}\n{sender_email}"
        ),
    },
    "rejection": {
        "label": "Từ chối ứng viên",
        "subject": "Kết quả ứng tuyển vị trí {position} tại {company}",
        "body": (
            "Kính gửi {name},\n\n"
            "Cảm ơn bạn đã dành thời gian ứng tuyển vị trí {position} tại {company} và tham gia "
            "quy trình tuyển dụng của chúng tôi.\n\n"
            "Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hiện tại chúng tôi đã "
            "lựa chọn một ứng viên khác có kinh nghiệm phù hợp hơn với yêu cầu của vị trí này.\n\n"
            "Chúng tôi đánh giá cao năng lực của bạn và sẽ lưu hồ sơ vào nguồn ứng viên tiềm năng "
            "(talent pool) để liên hệ khi có cơ hội phù hợp trong tương lai.\n\n"
            "Chúc bạn sớm tìm được công việc như ý.\n\n"
            "Trân trọng,\n{sender_name}\n{company}\n{sender_email}"
        ),
    },
    "offer": {
        "label": "Thư mời nhận việc (Offer)",
        "subject": "Thư mời nhận việc - Vị trí {position} tại {company}",
        "body": (
            "Kính gửi {name},\n\n"
            "Chúc mừng bạn! Sau quá trình phỏng vấn và đánh giá, {company} trân trọng mời bạn "
            "gia nhập đội ngũ với vị trí {position}.\n\n"
            "Thông tin đề xuất:\n"
            "  • Vị trí: {position}\n"
            "  • Phòng ban: {department}\n"
            "  • Mức lương đề xuất: {salary}\n"
            "  • Ngày dự kiến bắt đầu: {start_date}\n\n"
            "Vui lòng phản hồi email này trong vòng 5 ngày làm việc để xác nhận. Thư mời chi tiết "
            "kèm hợp đồng sẽ được gửi sau khi bạn xác nhận đồng ý.\n\n"
            "Rất mong được chào đón bạn vào đội ngũ {company}!\n\n"
            "Trân trọng,\n{sender_name}\n{company}\n{sender_email}"
        ),
    },
}


def list_templates() -> list[dict]:
    return [{"id": k, "label": v["label"]} for k, v in TEMPLATES.items()]


def render_template(template_id: str, candidate: dict, extra: dict = None) -> dict:
    """Render subject/body for a given template id + candidate dict + extra vars."""
    extra = extra or {}
    if template_id not in TEMPLATES:
        raise ValueError(f"Unknown template: {template_id}")

    tpl = TEMPLATES[template_id]
    ctx = {
        "name": candidate.get("name", ""),
        "position": candidate.get("position", ""),
        "department": candidate.get("department", ""),
        "company": COMPANY_NAME,
        "sender_name": HR_SENDER_NAME,
        "sender_email": HR_SENDER_EMAIL,
        "interview_type": extra.get("interview_type", "Phỏng vấn trực tiếp"),
        "interview_time": extra.get("interview_time", "Sẽ thông báo sau"),
        "interview_location": extra.get("interview_location", "Văn phòng công ty"),
        "salary": extra.get("salary", "Thỏa thuận"),
        "start_date": extra.get("start_date", _fmt_date()),
    }

    subject = tpl["subject"].format(**ctx)
    body = tpl["body"].format(**ctx)
    return {"subject": subject, "body": body}


def send_email(to_email: str, subject: str, body: str) -> dict:
    """
    SIMULATED send. Replace this implementation with a real SMTP/API call
    (e.g. smtplib, SendGrid, Mailgun) when ready to send real emails.
    Always returns a result dict so the caller can log it.
    """
    print(f"[SIMULATED EMAIL] To: {to_email} | Subject: {subject}")
    return {"status": "sent", "provider": "simulated"}