"""
Import the Kaggle "Resume Dataset" (archive.zip -> Resume/Resume.csv) into the
candidates table.

The dataset only contains resume text + a job Category — it has NO real name,
email or phone. This script generates realistic Vietnamese candidate identities
(name, email, phone, location) deterministically from each row's ID, so the
data is stable across re-runs, and maps the dataset's Category to our
position/department/skills.

Usage (from backend/ directory):
    python -m scripts.import_resumes                # import all rows
    python -m scripts.import_resumes --limit 100     # import first 100 rows
    python -m scripts.import_resumes --reset         # wipe candidates table first
"""
import argparse
import csv
import os
import random
import re
import sys
import uuid
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal, CandidateDB, init_db  # noqa: E402

ARCHIVE_PATH = Path(os.getenv("ARCHIVE_PATH", "../archive"))
CSV_PATH = ARCHIVE_PATH / "Resume" / "Resume.csv"

# ---- Vietnamese name pools (used to deterministically build fake identities) ----
HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
      "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
DEM_NAM = ["Văn", "Hữu", "Đức", "Minh", "Quang", "Thành", "Công", "Anh"]
DEM_NU = ["Thị", "Ngọc", "Kim", "Thu", "Hồng", "Lan", "Bích", "Diệu"]
TEN_NAM = ["An", "Bình", "Cường", "Dũng", "Đạt", "Hải", "Hùng", "Khang", "Long",
           "Minh", "Nam", "Phong", "Quân", "Sơn", "Tài", "Thắng", "Tuấn", "Việt", "Khoa", "Huy"]
TEN_NU = ["Anh", "Châu", "Diệp", "Giang", "Hà", "Hạnh", "Hoa", "Huyền", "Linh",
          "Mai", "My", "Ngân", "Nhi", "Phương", "Quỳnh", "Thảo", "Trang", "Vy", "Yến", "Xuân"]
LOCATIONS = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Nha Trang"]

# Map dataset Category -> (department, default position, extra skills)
CATEGORY_MAP = {
    "HR": ("Human Resources", "HR Specialist", ["Tuyển dụng", "C&B", "Quan hệ lao động"]),
    "DESIGNER": ("Design", "UI/UX Designer", ["Figma", "Adobe XD", "Photoshop"]),
    "INFORMATION-TECHNOLOGY": ("Engineering", "IT Specialist", ["Networking", "SQL", "Linux"]),
    "TEACHER": ("Education", "Giảng viên đào tạo", ["Sư phạm", "Thiết kế chương trình"]),
    "ADVOCATE": ("Legal", "Chuyên viên pháp lý", ["Luật", "Soạn thảo hợp đồng"]),
    "BUSINESS-DEVELOPMENT": ("Business", "Business Development Executive", ["Đàm phán", "CRM", "Sales"]),
    "HEALTHCARE": ("Healthcare", "Healthcare Specialist", ["Chăm sóc bệnh nhân", "Y khoa"]),
    "FITNESS": ("Operations", "Fitness Trainer", ["Huấn luyện thể chất", "Dinh dưỡng"]),
    "AGRICULTURE": ("Operations", "Agriculture Specialist", ["Nông nghiệp", "Quản lý trang trại"]),
    "BPO": ("Customer Service", "BPO Associate", ["Chăm sóc khách hàng", "Tổng đài"]),
    "SALES": ("Sales", "Sales Executive", ["Bán hàng", "Đàm phán", "CRM"]),
    "CONSULTANT": ("Consulting", "Business Consultant", ["Tư vấn chiến lược", "Phân tích"]),
    "DIGITAL-MEDIA": ("Marketing", "Digital Media Specialist", ["SEO", "Content", "Social Media"]),
    "AUTOMOBILE": ("Operations", "Automobile Technician", ["Kỹ thuật ô tô", "Bảo trì"]),
    "CHEF": ("Operations", "Chef", ["Ẩm thực", "Quản lý bếp"]),
    "FINANCE": ("Finance", "Finance Analyst", ["Excel", "Phân tích tài chính", "Báo cáo"]),
    "APPAREL": ("Operations", "Apparel Specialist", ["Thời trang", "Merchandising"]),
    "ENGINEERING": ("Engineering", "Engineer", ["AutoCAD", "Quản lý dự án"]),
    "ACCOUNTANT": ("Finance", "Accountant", ["Kế toán", "Excel", "Thuế"]),
    "CONSTRUCTION": ("Operations", "Construction Manager", ["Quản lý công trình", "AutoCAD"]),
    "PUBLIC-RELATIONS": ("Marketing", "PR Specialist", ["Truyền thông", "Báo chí"]),
    "BANKING": ("Finance", "Banking Specialist", ["Tín dụng", "Ngân hàng"]),
    "ARTS": ("Design", "Creative Specialist", ["Sáng tạo", "Mỹ thuật"]),
    "AVIATION": ("Operations", "Aviation Specialist", ["Hàng không", "An toàn bay"]),
}

STAGES = ['applied', 'cv_screening', 'hr_interview', 'technical_interview',
          'manager_interview', 'offer', 'hired', 'rejected']
STAGE_WEIGHTS = [30, 20, 15, 12, 8, 6, 5, 4]
SOURCES = ['linkedin', 'website', 'referral', 'headhunt', 'other']

ASCII_MAP = str.maketrans(
    "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ"
    "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ",
    "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd"
    "AAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD"
)


def to_ascii(s: str) -> str:
    return s.translate(ASCII_MAP)


def gen_identity(seed_id: str):
    rng = random.Random(seed_id)  # deterministic per resume ID
    is_male = rng.random() < 0.5
    ho = rng.choice(HO)
    dem = rng.choice(DEM_NAM if is_male else DEM_NU)
    ten = rng.choice(TEN_NAM if is_male else TEN_NU)
    full_name = f"{ho} {dem} {ten}"

    email_local = to_ascii(f"{ten}.{ho}{rng.randint(1, 999)}").lower().replace(" ", "")
    email = f"{email_local}@gmail.com"

    phone = f"09{rng.randint(10000000, 99999999)}"
    location = rng.choice(LOCATIONS)
    experience = rng.randint(0, 15)
    stage = rng.choices(STAGES, weights=STAGE_WEIGHTS, k=1)[0]
    source = rng.choice(SOURCES)
    days_ago = rng.randint(0, 180)
    applied_date = str(date.today() - timedelta(days=days_ago))
    matching_score = rng.randint(45, 98) if rng.random() < 0.7 else None
    expected_salary = rng.choice([None, 12000000, 15000000, 18000000, 22000000, 28000000, 35000000])

    return {
        "name": full_name,
        "email": email,
        "phone": phone,
        "location": location,
        "experience": experience,
        "stage": stage,
        "source": source,
        "applied_date": applied_date,
        "matching_score": matching_score,
        "expected_salary": expected_salary,
    }


def extract_education(text: str) -> str:
    match = re.search(r"(Bachelor|Master|MBA|B\.?S\.?|M\.?S\.?|Ph\.?D\.?)[^\n]{0,60}", text or "", re.IGNORECASE)
    return match.group(0).strip() if match else "Đại học"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None, help="Limit number of rows imported")
    parser.add_argument("--reset", action="store_true", help="Delete existing candidates before import")
    args = parser.parse_args()

    if not CSV_PATH.exists():
        print(f"❌ Không tìm thấy {CSV_PATH}. Đặt ARCHIVE_PATH trỏ đúng thư mục archive/.")
        sys.exit(1)

    init_db()
    db = SessionLocal()

    if args.reset:
        deleted = db.query(CandidateDB).delete()
        db.commit()
        print(f"🗑️  Đã xóa {deleted} ứng viên cũ.")

    existing_emails = {e for (e,) in db.query(CandidateDB.email).all()}

    count = 0
    skipped = 0
    with open(CSV_PATH, encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if args.limit and count >= args.limit:
                break

            category = (row.get("Category") or "OTHER").upper()
            dept, position, extra_skills = CATEGORY_MAP.get(
                category, ("Operations", category.title(), [])
            )
            identity = gen_identity(row.get("ID", str(count)))

            if identity["email"] in existing_emails:
                skipped += 1
                continue
            existing_emails.add(identity["email"])

            cv_text = (row.get("Resume_str") or "")[:6000]

            candidate = CandidateDB(
                id=str(uuid.uuid4()),
                name=identity["name"],
                email=identity["email"],
                phone=identity["phone"],
                position=position,
                department=dept,
                experience=identity["experience"],
                education=extract_education(cv_text),
                skills=extra_skills,
                certifications=[],
                stage=identity["stage"],
                matching_score=identity["matching_score"],
                source=identity["source"],
                applied_date=identity["applied_date"],
                notes="",
                location=identity["location"],
                expected_salary=identity["expected_salary"],
                cv_text=cv_text,
                category=category,
                talent_pool=(identity["stage"] == "rejected" and identity["experience"] >= 5),
            )
            db.add(candidate)
            count += 1

            if count % 200 == 0:
                db.commit()
                print(f"  ...{count} ứng viên đã import")

    db.commit()
    db.close()
    print(f"✅ Hoàn tất: đã import {count} ứng viên (bỏ qua {skipped} trùng email).")


if __name__ == "__main__":
    main()