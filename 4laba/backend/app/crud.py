# app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from app.security import encrypt_password, decrypt_password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- USERS ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- CATEGORIES ---
def create_category(db: Session, user_id: int, category: schemas.CategoryCreate):
    db_cat = models.Category(user_id=user_id, name=category.name)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

def get_categories(db: Session, user_id: int):
    return db.query(models.Category).filter(models.Category.user_id == user_id).all()

# --- PASSWORDS ---
def create_password(db: Session, user_id: int, password: schemas.PasswordEntryCreate):
    encrypted_pass = encrypt_password(password.password_enc)
    db_pass = models.PasswordEntry(
        **password.dict(exclude={"password_enc"}),
        password_enc=encrypted_pass,
        user_id=user_id
    )
    db.add(db_pass)
    db.commit()
    db.refresh(db_pass)
    return db_pass

def get_passwords(db: Session, user_id: int):
    return db.query(models.PasswordEntry).filter(models.PasswordEntry.user_id == user_id).all()

def update_category(db: Session, user_id: int, category_id: int, category_update: schemas.CategoryUpdate):
    category = db.query(models.Category).filter(models.Category.id == category_id, models.Category.user_id == user_id).first()
    if not category:
        return None
    for key, value in category_update.dict(exclude_unset=True).items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, user_id: int, category_id: int):
    category = db.query(models.Category).filter(models.Category.id == category_id, models.Category.user_id == user_id).first()
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True

def update_password(db: Session, user_id: int, password_id: int, password_update: schemas.PasswordEntryUpdate):
    password = db.query(models.PasswordEntry).filter(models.PasswordEntry.id == password_id, models.PasswordEntry.user_id == user_id).first()
    if not password:
        return None
    update_data = password_update.dict(exclude_unset=True)
    if "password_enc" in update_data:
        update_data["password_enc"] = encrypt_password(update_data["password_enc"])
    for key, value in update_data.items():
        setattr(password, key, value)
    db.commit()
    db.refresh(password)
    return password

def delete_password(db: Session, user_id: int, password_id: int):
    password = db.query(models.PasswordEntry).filter(models.PasswordEntry.id == password_id, models.PasswordEntry.user_id == user_id).first()
    if not password:
        return False
    db.delete(password)
    db.commit()
    return True
