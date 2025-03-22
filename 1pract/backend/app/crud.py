from sqlalchemy.orm import Session
from . import models

def create_password_entry(db: Session, service_name: str, password: str):
    db_entry = models.PasswordEntry(
        service_name=service_name,
        password=password
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_all_passwords(db: Session):
    return db.query(models.PasswordEntry).all()

def delete_password_entry(db: Session, entry_id: int):
    entry = db.query(models.PasswordEntry).filter(models.PasswordEntry.id == entry_id).first()
    if entry:
        db.delete(entry)
        db.commit()
    return entry