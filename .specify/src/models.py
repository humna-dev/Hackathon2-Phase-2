"""
Task model definition for the Todo application.
"""
from dataclasses import dataclass

@dataclass
class Task:
    """
    Represents a task in the todo list.
    
    Attributes:
        id: Integer, unique identifier for the task
        title: String, the title of the task (required, non-empty)
        description: String, optional description of the task (can be empty)
        completed: Boolean, indicates whether the task is completed (default: False)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False