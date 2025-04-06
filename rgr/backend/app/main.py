from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, auth, crypto
from .database import SessionLocal, engine
from datetime import timedelta
import secrets
import base64
from pydantic import BaseModel
from . import models  # Добавлен импорт models

# Модель для регистрации
class RegisterRequest(BaseModel):
    username: str
    password: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
async def register(
    request: RegisterRequest,  # Изменено на модель Pydantic
    db: Session = Depends(get_db)
):
    if db.query(models.User).filter(models.User.username == request.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    user = auth.create_user(db, request.username, request.password)
    return {"user_id": user.id}

@app.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "salt": base64.b64encode(user.salt).decode()
    }
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    file_data = await file.read()
    key = crypto.generate_key("", current_user.salt)  # Адаптируйте под вашу логику
    
    encrypted_data, iv = crypto.encrypt_data(file_data, key)
    
    db_file = models.EncryptedFile(
        id=secrets.token_hex(16),
        user_id=current_user.id,
        filename=file.filename,
        encrypted_data=encrypted_data,
        iv=iv
    )
    db.add(db_file)
    db.commit()
    
    return {
        "status": "success",
        "file_id": db_file.id,
        "filename": file.filename
    }