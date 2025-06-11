# app/routers/passwords.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud, database, auth
from fastapi import HTTPException, status, Path
from fastapi import Body
from app.security import decrypt_password

router = APIRouter()

def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    user_data = auth.decode_access_token(token)
    if user_data is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_username(db, user_data["sub"])
    return user

@router.post("/", response_model=schemas.PasswordEntryOut)
def create_password(password: schemas.PasswordEntryCreate, db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    return crud.create_password(db, current_user.id, password)

@router.get("/", response_model=list[schemas.PasswordEntryOut])
def list_passwords(db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    passwords = crud.get_passwords(db, current_user.id)
    for p in passwords:
        p.password_enc = decrypt_password(p.password_enc)
    return passwords

@router.patch("/{password_id}", response_model=schemas.PasswordEntryOut)
def patch_password(
    password_id: int = Path(..., gt=0),
    password_update: schemas.PasswordEntryUpdate = Body(...),
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user),
):
    updated_password = crud.update_password(db, current_user.id, password_id, password_update)
    if not updated_password:
        raise HTTPException(status_code=404, detail="Password not found")
    return updated_password

@router.delete("/{password_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_password(
    password_id: int = Path(..., gt=0),
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user),
):
    deleted = crud.delete_password(db, current_user.id, password_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Password not found")
    return