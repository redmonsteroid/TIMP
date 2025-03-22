from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, crud
from ..database import get_db
import secrets

router = APIRouter(prefix="/api", tags=["API"])

@router.get("/test")
async def test_endpoint():
    return {"message": "Тестовый эндпоинт работает!"}

def generate_secure_password(length: int, use_special: bool) -> str:
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    if use_special:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    return ''.join(secrets.choice(chars) for _ in range(length))

@router.post("/generate", response_model=schemas.PasswordEntryResponse)
async def generate_password(
    request: schemas.PasswordCreate,
    db: Session = Depends(get_db)
):
    if request.length < 8:
        raise HTTPException(status_code=400, detail="Минимальная длина пароля — 8 символов")
    
    password = generate_secure_password(request.length, request.use_special)
    return crud.create_password_entry(db, request.service_name, password)

@router.get("/passwords", response_model=list[schemas.PasswordEntryResponse])
async def read_passwords(db: Session = Depends(get_db)):
    return crud.get_all_passwords(db)

@router.delete("/passwords/{entry_id}")
async def delete_password(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.delete_password_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    return {"message": "Запись удалена"}