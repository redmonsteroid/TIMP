from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class PasswordEntry(Base):
    __tablename__ = "passwords"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, nullable=False)  # Название сервиса
    password = Column(String, nullable=False)      # Сгенерированный пароль
    created_at = Column(DateTime, default=datetime.utcnow)