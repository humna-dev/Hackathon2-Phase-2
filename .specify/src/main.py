"""
Console-based Todo application main entry point.
"""
from todo import TodoApp

from models import Task

def display_menu():
    """
    Display the main menu options to the user.
    """
    print("\n--- Todo Application ---")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Toggle Task Completion")
    print("6. Exit")
    print("------------------------")

def get_task_display_string(task: Task) -> str:
    """
    Format a task for display with its ID, title, and completion status.
    
    Args:
        task: The Task object to format
        
    Returns:
        A formatted string representation of the task
    """
    status = "✓" if task.completed else "○"
    return f"[{status}] ID: {task.id} - {task.title}"

def main():
    """
    Main function to run the console-based todo application.
    """
    app = TodoApp()
    
    while True:
        display_menu()
        
        try:
            choice = input("Enter your choice (1-6): ").strip()
        except (EOFError, KeyboardInterrupt):
            # Handle case where input is not available (e.g. running in non-interactive environment)
            print("\nExiting...")
            break
        
        if choice == "1":
            # Add Task
            title = input("Enter task title: ").strip()
            if not title:
                print("Task title cannot be empty!")
                continue
            
            description = input("Enter task description (optional): ").strip()
            task = app.add_task(title, description)
            
            if task:
                print(f"Task '{task.title}' added successfully with ID {task.id}")
            else:
                print("Failed to add task. Title cannot be empty.")
        
        elif choice == "2":
            # View Tasks
            tasks = app.list_tasks()
            
            if not tasks:
                print("No tasks available.")
            else:
                print("\nYour Tasks:")
                for task in tasks:
                    print(get_task_display_string(task))
                    if task.description:
                        print(f"    Description: {task.description}")
        
        elif choice == "3":
            # Update Task
            try:
                task_id = int(input("Enter task ID to update: "))
            except ValueError:
                print("Invalid task ID. Please enter a number.")
                continue
            
            task = app.get_task(task_id)
            if not task:
                print(f"Task with ID {task_id} not found.")
                continue
            
            new_title = input(f"Enter new title (current: '{task.title}'): ").strip()
            new_description = input(f"Enter new description (current: '{task.description}'): ").strip()
            
            # Use None if the user didn't provide new values, so we don't update those fields
            title_to_update = new_title if new_title else None
            description_to_update = new_description if new_description else None
            
            if app.update_task(task_id, title_to_update, description_to_update):
                print(f"Task with ID {task_id} updated successfully.")
            else:
                print(f"Failed to update task with ID {task_id}.")
        
        elif choice == "4":
            # Delete Task
            try:
                task_id = int(input("Enter task ID to delete: "))
            except ValueError:
                print("Invalid task ID. Please enter a number.")
                continue
            
            if app.delete_task(task_id):
                print(f"Task with ID {task_id} deleted successfully.")
            else:
                print(f"Task with ID {task_id} not found.")
        
        elif choice == "5":
            # Toggle Task Completion
            try:
                task_id = int(input("Enter task ID to toggle: "))
            except ValueError:
                print("Invalid task ID. Please enter a number.")
                continue
            
            task = app.get_task(task_id)
            if not task:
                print(f"Task with ID {task_id} not found.")
                continue
            
            if app.toggle_task_completion(task_id):
                status = "completed" if task.completed else "incomplete"
                print(f"Task with ID {task_id} marked as {status}.")
            else:
                print(f"Failed to toggle task with ID {task_id}.")
        
        elif choice == "6":
            # Exit
            print("Thank you for using the Todo Application. Goodbye!")
            break
        
        else:
            print("Invalid choice. Please enter a number between 1 and 6.")

if __name__ == "__main__":
    main()