"""
TodoApp class implementation for managing tasks.
"""
from models import Task
from typing import List, Optional

class TodoApp:
    """
    Todo application class that manages tasks in memory.
    """
    def __init__(self):
        """
        Initialize the TodoApp with an empty task list and a counter for IDs.
        """
        self.tasks: List[Task] = []
        self.next_id: int = 1
    
    def add_task(self, title: str, description: str = "") -> Optional[Task]:
        """
        Add a new task with the given title and optional description.
        
        Args:
            title: The title of the task (required, non-empty)
            description: The description of the task (optional)
            
        Returns:
            The created Task object, or None if title is empty
        """
        if not title or not title.strip():
            return None
        
        task = Task(id=self.next_id, title=title.strip(), description=description.strip())
        self.tasks.append(task)
        self.next_id += 1
        return task
    
    def list_tasks(self) -> List[Task]:
        """
        Get a list of all tasks.
        
        Returns:
            A list of all Task objects
        """
        return self.tasks
    
    def get_task(self, task_id: int) -> Optional[Task]:
        """
        Get a specific task by its ID.
        
        Args:
            task_id: The ID of the task to retrieve
            
        Returns:
            The Task object if found, None otherwise
        """
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def update_task(self, task_id: int, title: str = None, description: str = None) -> bool:
        """
        Update an existing task with new title and/or description.
        
        Args:
            task_id: The ID of the task to update
            title: New title for the task (optional)
            description: New description for the task (optional)
            
        Returns:
            True if the task was updated, False if task was not found
        """
        task = self.get_task(task_id)
        if task is None:
            return False
        
        if title is not None:
            task.title = title.strip()
        if description is not None:
            task.description = description.strip()
        
        return True
    
    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.
        
        Args:
            task_id: The ID of the task to delete
            
        Returns:
            True if the task was deleted, False if task was not found
        """
        task = self.get_task(task_id)
        if task is None:
            return False
        
        self.tasks.remove(task)
        return True
    
    def toggle_task_completion(self, task_id: int) -> bool:
        """
        Toggle the completion status of a task.
        
        Args:
            task_id: The ID of the task to toggle
            
        Returns:
            True if the task status was toggled, False if task was not found
        """
        task = self.get_task(task_id)
        if task is None:
            return False
        
        task.completed = not task.completed
        return True