from fastapi.security import HTTPBearer
from jose import JWTError
from .auth import decode_token
from fastapi import Depends, HTTPException

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = decode_token(token.credentials)
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")