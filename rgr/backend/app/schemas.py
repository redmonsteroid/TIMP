from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str

class FileUpload(BaseModel):
    filename: str
    user_id: str

class Token(BaseModel):
    access_token: str
    token_type: str