from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from datetime import timedelta
from .. import schemas, crud
from ..database import get_session
from ..auth import get_current_user, create_access_token, verify_password
from .routes import tasks
from ..models import User
from ..config import settings


router = APIRouter()

# Include task routes
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])


@router.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    db_user = crud.get_user_by_username(session, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = crud.get_user_by_email(session, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(session, user)


@router.post("/auth/login", response_model=schemas.Token)
def login(username: str, password: str, session: Session = Depends(get_session)):
    user = crud.get_user_by_username(session, username=username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}