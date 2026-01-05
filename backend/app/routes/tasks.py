from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

from ..models import Task, TaskList
from ..schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListCreate, TaskListResponse
from ..database import get_session

router = APIRouter()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token_type, token = authorization.split()
        if token_type.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except (ValueError, JWTError):
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- TASK LISTS ----------

@router.get("/lists", response_model=List[TaskListResponse])
async def get_lists(
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    statement = select(TaskList).where(TaskList.user_id == user_id)
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/lists", response_model=TaskListResponse)
async def create_list(
    task_list: TaskListCreate,
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    # Check if list name already exists for this user
    statement = select(TaskList).where(
        TaskList.user_id == user_id,
        TaskList.name == task_list.name
    )
    result = await session.execute(statement)
    existing_list = result.scalar_one_or_none()
    
    if existing_list:
        raise HTTPException(status_code=400, detail="List name already exists")
    
    db_list = TaskList(
        name=task_list.name,
        user_id=user_id
    )
    
    session.add(db_list)
    await session.commit()
    await session.refresh(db_list)
    return db_list

@router.delete("/lists/{list_id}")
async def delete_list(
    list_id: int,
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    statement = select(TaskList).where(TaskList.id == list_id, TaskList.user_id == user_id)
    result = await session.execute(statement)
    db_list = result.scalar_one_or_none()
    
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found")
    
    # Update tasks in this list to have no list
    tasks_statement = select(Task).where(Task.list_id == list_id, Task.user_id == user_id)
    tasks_result = await session.execute(tasks_statement)
    tasks = tasks_result.scalars().all()
    
    for task in tasks:
        task.list_id = None
    
    await session.delete(db_list)
    await session.commit()
    return {"message": "List deleted successfully"}

# ---------- TASKS ----------

@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    statement = select(Task).where(Task.user_id == user_id)
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/tasks", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    # Validate list_id if provided
    if task.list_id:
        list_statement = select(TaskList).where(
            TaskList.id == task.list_id,
            TaskList.user_id == user_id
        )
        list_result = await session.execute(list_statement)
        if not list_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Invalid list ID")
    
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        list_id=task.list_id,
        user_id=user_id
    )
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Validate list_id if being updated
    if task_update.list_id is not None:
        if task_update.list_id > 0:  # 0 or None means no list
            list_statement = select(TaskList).where(
                TaskList.id == task_update.list_id,
                TaskList.user_id == user_id
            )
            list_result = await session.execute(list_statement)
            if not list_result.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Invalid list ID")
    
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(verify_token)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await session.delete(db_task)
    await session.commit()
    return {"message": "Task deleted successfully"}