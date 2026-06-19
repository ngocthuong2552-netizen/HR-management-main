# AI-Powered HR Management System

Hệ thống quản lý nhân sự tích hợp AI toàn diện, bao gồm ATS, Analytics, LMS và các công cụ AI.

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| Backend | FastAPI (Python) |
| Database | SQLite + SQLAlchemy |
| AI | Claude / Gemini / OpenAI (tùy chọn) |
| CV Data | 66,000+ CV thực tế (PDF + CSV) |

## Cấu trúc dự án

```
HR-Management/
├── frontend/                   # React + TypeScript
│   └── src/
│       ├── components/
│       │   ├── layout/         # Sidebar, Header, Layout
│       │   └── ui/             # Badge, Modal, StatsCard
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── ats/            # Candidates, Pipeline, TalentPool
│       │   ├── recruitment/    # Jobs, Requests
│       │   ├── Analytics.tsx
│       │   ├── lms/            # Courses, LearningPaths
│       │   └── ai/             # Chatbot, CVParser, JDGenerator, Interview
│       ├── data/mockData.ts    # Dữ liệu mẫu
│       └── types/index.ts      # TypeScript types
│
├── backend/                    # FastAPI + Python
│   ├── app/
│   │   ├── main.py             # Entry point + CORS
│   │   ├── database.py         # SQLAlchemy models
│   │   ├── routes/
│   │   │   ├── ai_routes.py    # /api/ai/* endpoints
│   │   │   └── candidate_routes.py
│   │   └── services/
│   │       ├── ai_service.py   # Claude AI integration
│   │       └── cv_service.py   # CV parsing + dataset
│   ├── requirements.txt
│   └── .env                    # API keys
│
├── archive/                    # Dữ liệu thực
│   ├── Resume/Resume.csv       # 66,000+ CV records
│   └── data/data/              # PDF CV theo 24 ngành
│       ├── ENGINEERING/
│       ├── INFORMATION-TECHNOLOGY/
│       ├── FINANCE/
│       └── ...
│
└── start.sh                    # Script khởi động nhanh
```

## Cài đặt & Khởi chạy

### 1. Cấu hình AI Provider

Mở file `backend/.env` và chọn **một** trong ba provider bên dưới:

---

#### Option A — Claude (Anthropic) ✅ Mặc định

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

DATABASE_URL=sqlite:///./hr_management.db
ARCHIVE_PATH=../archive
```

> Lấy key tại: https://console.anthropic.com  
> Model mặc định: `claude-haiku-4-5-20251001` (nhanh, rẻ)  
> Có thể đổi sang `claude-sonnet-4-6` để chất lượng cao hơn

---

#### Option B — Gemini (Google)

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxx

DATABASE_URL=sqlite:///./hr_management.db
ARCHIVE_PATH=../archive
```

> Lấy key tại: https://aistudio.google.com/app/apikey  
> Model mặc định: `gemini-1.5-flash` (miễn phí trong giới hạn)

---

#### Option C — OpenAI (ChatGPT)

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxxxxxx

DATABASE_URL=sqlite:///./hr_management.db
ARCHIVE_PATH=../archive
```

> Lấy key tại: https://platform.openai.com/api-keys  
> Model mặc định: `gpt-4o-mini` (nhanh, rẻ)  
> Có thể đổi sang `gpt-4o` để chất lượng cao hơn

---

> **Lưu ý:** Nếu không có API key nào, hệ thống vẫn chạy bình thường với fallback response có sẵn. Các tính năng AI sẽ trả về câu trả lời mẫu thay vì gọi API thật.

### 2. Chạy Backend

```bash
cd backend
venv/bin/uvicorn app.main:app --reload --port 8000
```

Backend sẽ chạy tại: http://localhost:8000
API docs (Swagger): http://localhost:8000/docs

### 3. Chạy Frontend

Mở terminal mới:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

### Hoặc dùng script tổng hợp

```bash
chmod +x start.sh
./start.sh
```

## Các module chính

### 1. ATS - Applicant Tracking System

| Trang | Mô tả |
|-------|-------|
| `/ats/candidates` | Cơ sở dữ liệu ứng viên, tìm kiếm theo kỹ năng/vị trí |
| `/ats/pipeline` | Kanban board kéo thả qua 7 vòng tuyển dụng |
| `/ats/talent-pool` | Lưu trữ ứng viên tiềm năng cho đợt tuyển sau |

**Pipeline stages:** Applied → CV Screening → HR Interview → Technical → Manager → Offer → Hired/Rejected

### 2. Recruitment Management

| Trang | Mô tả |
|-------|-------|
| `/recruitment/jobs` | Quản lý Job Descriptions đang mở |
| `/recruitment/requests` | Yêu cầu tuyển dụng + phê duyệt đa cấp |

**Approval workflow:** Team Lead → Department Head → HR → Approved

### 3. Analytics Dashboard

- `/analytics` — Biểu đồ Time-to-Hire, funnel tuyển dụng, nguồn ứng viên, hiệu suất recruiter

### 4. LMS - Learning Management System

| Trang | Mô tả |
|-------|-------|
| `/lms/courses` | Catalog khóa học (Onboarding, Technical, Soft Skills, Leadership) |
| `/lms/paths` | Lộ trình đào tạo theo nhóm nhân viên |

### 5. AI Tools

| Trang | Mô tả |
|-------|-------|
| `/ai/chatbot` | HR Chatbot hỗ trợ nhân viên & ứng viên (tiếng Việt) |
| `/ai/cv-parser` | Phân tích CV từ file upload hoặc dataset 66,000 CV |
| `/ai/jd-generator` | Tạo Job Description tự động |
| `/ai/interview` | Sinh câu hỏi phỏng vấn + đánh giá ứng viên |

## API Endpoints

```
GET  /                          Health check
GET  /docs                      Swagger UI

POST /api/ai/chat               HR Chatbot
POST /api/ai/parse-cv           Phân tích CV upload
GET  /api/ai/parse-sample       Phân tích CV từ dataset (/?category=ENGINEERING)
POST /api/ai/generate-jd        Tạo Job Description
POST /api/ai/interview-questions Sinh câu hỏi phỏng vấn
POST /api/ai/evaluate-candidate  Đánh giá ứng viên
GET  /api/ai/categories         Danh sách ngành trong dataset

GET  /api/candidates/           Danh sách ứng viên
POST /api/candidates/           Thêm ứng viên mới
GET  /api/candidates/{id}       Chi tiết ứng viên
PATCH /api/candidates/{id}      Cập nhật ứng viên
GET  /api/candidates/stats/pipeline  Thống kê pipeline
```

## Dataset CV thực tế

Thư mục `archive/` chứa dữ liệu CV thực từ Kaggle:

- **Resume.csv**: 66,000+ hồ sơ với text đầy đủ, phân loại theo ngành
- **data/data/**: PDF CV gốc chia theo 24 ngành:
  `ACCOUNTANT, ADVOCATE, AGRICULTURE, APPAREL, ARTS, AUTOMOBILE, AVIATION, BANKING, BPO, BUSINESS-DEVELOPMENT, CHEF, CONSTRUCTION, CONSULTANT, DESIGNER, DIGITAL-MEDIA, ENGINEERING, FINANCE, FITNESS, HEALTHCARE, HR, INFORMATION-TECHNOLOGY, PUBLIC-RELATIONS, SALES, TEACHER`

Tính năng **CV Parser** có thể phân tích CV ngẫu nhiên từ bất kỳ ngành nào trong dataset này.

## Lưu ý

- Frontend hoạt động với mock data ngay cả khi không có backend
- AI features cần `ANTHROPIC_API_KEY` hợp lệ; nếu không có key sẽ dùng fallback response
- Database SQLite được tạo tự động khi khởi động backend lần đầu
