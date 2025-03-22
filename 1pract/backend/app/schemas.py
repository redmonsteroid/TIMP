from pydantic import BaseModel, constr
from datetime import datetime

class PasswordCreate(BaseModel):
    service_name: str
    length: int = 12
    use_special: bool = True

class PasswordEntryResponse(BaseModel):
    id: int
    service_name: str
    password: str
    created_at: datetime

    class Config:
        from_attributes = True  # Было: orm_mode = True