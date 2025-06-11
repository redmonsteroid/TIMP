# app/routers/errors.py
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import ErrorLog
from typing import Optional

# Получаем сессию БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функция логирования ошибки
def log_error_to_db(
    db: Session,
    request: Request,
    status_code: int,
    error_message: str,
    user_id: Optional[int] = None,
):
    error = ErrorLog(
        user_id=user_id,
        endpoint=str(request.url.path),
        method=request.method,
        status_code=status_code,
        error_message=error_message,
    )
    db.add(error)
    db.commit()

# Обработка HTTP ошибок (404, 422 и т.п.)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    db: Session = next(get_db())
    log_error_to_db(
        db=db,
        request=request,
        status_code=exc.status_code,
        error_message=str(exc.detail),
        user_id=None,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Обработка всех остальных ошибок (500 и т.п.)
async def internal_exception_handler(request: Request, exc: Exception):
    db: Session = next(get_db())
    log_error_to_db(
        db=db,
        request=request,
        status_code=500,
        error_message=str(exc),
        user_id=None,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )
