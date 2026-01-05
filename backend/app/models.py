from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime, date
import enum


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    tasks: list["Task"] = Relationship(back_populates="owner")
    lists: list["TaskList"] = Relationship(back_populates="owner")


class TaskList(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    owner: User = Relationship(back_populates="lists")
    tasks: list["Task"] = Relationship(back_populates="task_list")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    due_date: Optional[date] = Field(default=None)
    list_id: Optional[int] = Field(default=None, foreign_key="tasklist.id")
    user_id: int = Field(foreign_key="user.id", index=True)
    
    # Relationships
    owner: User = Relationship(back_populates="tasks")
    task_list: Optional[TaskList] = Relationship(back_populates="tasks")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)