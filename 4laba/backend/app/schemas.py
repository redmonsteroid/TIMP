from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- Users ---

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Password Entries ---

class PasswordEntryBase(BaseModel):
    title: str
    login: str
    password_enc: str
    url: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None

class PasswordEntryCreate(PasswordEntryBase):
    pass

class PasswordEntryUpdate(PasswordEntryBase):
    pass

class PasswordEntryOut(PasswordEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# --- Categories ---

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):  # <--- ЭТО ДОБАВЬ
    pass

class CategoryOut(CategoryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True  # <- заменено с orm_mode
