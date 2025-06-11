from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now())

    categories = relationship("Category", back_populates="user", cascade="all, delete")
    passwords = relationship("PasswordEntry", back_populates="user", cascade="all, delete")
    logs = relationship("ErrorLog", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)

    user = relationship("User", back_populates="categories")
    passwords = relationship("PasswordEntry", back_populates="category")

class PasswordEntry(Base):
    __tablename__ = "password_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(100), nullable=False)
    login = Column(String(100), nullable=False)
    password_enc = Column(Text, nullable=False)
    url = Column(String(255))
    notes = Column(Text)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now())

    user = relationship("User", back_populates="passwords")
    category = relationship("Category", back_populates="passwords")

class ErrorLog(Base):
    __tablename__ = "error_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    endpoint = Column(String(255))
    method = Column(String(10))
    status_code = Column(Integer)
    error_message = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=func.now())

    user = relationship("User", back_populates="logs")
