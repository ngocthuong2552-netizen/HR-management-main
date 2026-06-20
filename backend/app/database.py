from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hr_management.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CandidateDB(Base):
    __tablename__ = "candidates"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    position = Column(String)
    department = Column(String)
    experience = Column(Integer, default=0)
    education = Column(Text)
    skills = Column(JSON, default=[])
    certifications = Column(JSON, default=[])
    stage = Column(String, default="applied")
    matching_score = Column(Float, nullable=True)
    source = Column(String, default="website")
    applied_date = Column(String)
    notes = Column(Text, default="")
    location = Column(String)
    expected_salary = Column(Integer, nullable=True)
    cv_text = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    talent_pool = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class JobDB(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True)
    title = Column(String)
    department = Column(String)
    headcount = Column(Integer, default=1)
    filled = Column(Integer, default=0)
    type = Column(String, default="full-time")
    status = Column(String, default="open")
    priority = Column(String, default="medium")
    description = Column(Text)
    requirements = Column(JSON, default=[])
    benefits = Column(JSON, default=[])
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    location = Column(String)
    remote = Column(Boolean, default=False)
    posted_date = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class RecruitmentRequestDB(Base):
    __tablename__ = "recruitment_requests"
    id = Column(String, primary_key=True)
    position = Column(String)
    department = Column(String)
    headcount = Column(Integer, default=1)
    type = Column(String)
    priority = Column(String)
    needed_by = Column(String)
    reason = Column(Text)
    status = Column(String, default="pending")
    requested_by = Column(String)
    requested_date = Column(String)
    notes = Column(Text, default="")
    approvals = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)


class EmailLogDB(Base):
    __tablename__ = "email_logs"
    id = Column(String, primary_key=True)
    candidate_id = Column(String, index=True)
    candidate_email = Column(String)
    template = Column(String, default="custom")  # interview_invite | rejection | offer | custom
    subject = Column(String)
    body = Column(Text)
    status = Column(String, default="sent")  # sent | failed
    sent_by = Column(String, default="HR Admin")
    created_at = Column(DateTime, default=datetime.utcnow)


class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(String, default="employee")  # admin | employee
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)