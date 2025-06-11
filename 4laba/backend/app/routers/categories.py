# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session
from app import schemas, crud, database, auth, models
from app.database import get_db

router = APIRouter()

def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    user_data = auth.decode_access_token(token)
    if user_data is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_username(db, user_data["sub"])
    return user

@router.post("/", response_model=schemas.CategoryOut)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    return crud.create_category(db, current_user.id, category)

@router.get("/", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    return crud.get_categories(db, current_user.id)

@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_update: schemas.CategoryUpdate,
    category_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    updated_category = crud.update_category(db, current_user.id, category_id, category_update)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int = Path(..., gt=0),
    db: Session = Depends(database.get_db),
    current_user=Depends(get_current_user),
):
    deleted = crud.delete_category(db, current_user.id, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return

