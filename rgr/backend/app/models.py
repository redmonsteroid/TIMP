import uuid
from sqlalchemy import Column, String, LargeBinary
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    salt = Column(LargeBinary)

class EncryptedFile(Base):
    __tablename__ = "files"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    filename = Column(String)
    encrypted_data = Column(LargeBinary)
    iv = Column(LargeBinary)
