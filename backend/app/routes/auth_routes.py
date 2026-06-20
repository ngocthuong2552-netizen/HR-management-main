import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, UserDB
from app.services.auth_service import (
    hash_password, verify_password, is_allowed_email,
    create_access_token, ALLOWED_EMAIL_DOMAIN,
)
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "employee"  # admin | employee


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True


@router.post("/bootstrap-admin")
def bootstrap_admin(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    One-time endpoint to create the FIRST admin account, only works when
    there are zero users in the system yet. After that, new accounts must
    be created by an existing admin via /register.
    """
    if db.query(UserDB).count() > 0:
        raise HTTPException(400, "Hệ thống đã có tài khoản, không thể bootstrap nữa. Hãy đăng nhập admin để tạo thêm tài khoản.")
    if not is_allowed_email(req.email):
        raise HTTPException(400, f"Email phải thuộc domain @{ALLOWED_EMAIL_DOMAIN}")

    user = UserDB(
        id=str(uuid.uuid4()),
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        name=req.name,
        role="admin",
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "user": UserOut.model_validate(user)}


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db), _admin: UserDB = Depends(require_admin)):
    if not is_allowed_email(req.email):
        raise HTTPException(400, f"Email phải thuộc domain @{ALLOWED_EMAIL_DOMAIN}")
    if req.role not in ("admin", "employee"):
        raise HTTPException(400, "role phải là 'admin' hoặc 'employee'")
    if db.query(UserDB).filter(UserDB.email == req.email.lower()).first():
        raise HTTPException(400, "Email đã được đăng ký")

    user = UserDB(
        id=str(uuid.uuid4()),
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        name=req.name,
        role=req.role,
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    return UserOut.model_validate(user)


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(401, "Email hoặc mật khẩu không đúng")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "user": UserOut.model_validate(user)}


@router.get("/me")
def me(user: UserDB = Depends(get_current_user)):
    return UserOut.model_validate(user)


@router.get("/users")
def list_users(db: Session = Depends(get_db), _admin: UserDB = Depends(require_admin)):
    return db.query(UserDB).all()