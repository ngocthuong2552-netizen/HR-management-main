from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db, UserDB
from app.services.auth_service import decode_access_token


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> UserDB:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Chưa đăng nhập")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(401, "Token không hợp lệ hoặc đã hết hạn")

    user = db.query(UserDB).filter(UserDB.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(401, "Người dùng không tồn tại")
    return user


def require_admin(user: UserDB = Depends(get_current_user)) -> UserDB:
    if user.role != "admin":
        raise HTTPException(403, "Chỉ Quản lý (admin) mới có quyền thực hiện thao tác này")
    return user