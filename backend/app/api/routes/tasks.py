from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_session
from ..auth import get_current_user
from datetime import timedelta
from ..config import settings


router = APIRouter()


@router.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.create_task_for_user(session, task, current_user.id)


@router.get("/tasks/", response_model=List[schemas.TaskResponse])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    tasks = crud.get_tasks_by_user_id(session, current_user.id, skip=skip, limit=limit)
    return tasks


@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def read_task(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = crud.get_task_by_id(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = crud.update_task(session, task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    success = crud.delete_task(session, task_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}