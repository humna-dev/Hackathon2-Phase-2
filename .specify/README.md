# Hackathon II – Evolution of Todo: Phase-I

## Overview
This is Phase-I of the Hackathon II project, implementing a console-based todo application with core CRUD functionality. The application follows spec-driven development principles with in-memory storage only.

## Features
- Add new tasks with titles and optional descriptions
- View all tasks with their completion status
- Update existing tasks
- Delete tasks
- Toggle task completion status

## Setup Instructions
1. Ensure you have Python 3.13+ installed on your system
2. Navigate to the `.specify` directory
3. Run the application with the command: `python -m src.main`

## How to Run
```bash
cd .specify
python -m src.main
```

## Technical Details
- Console-based interface
- In-memory storage (tasks reset on program restart)
- Clean, beginner-friendly code structure
- No external dependencies required

## Project Structure
- `.specify/constitution.md` - Development principles and constraints
- `.specify/specs/task-crud.md` - Feature specifications
- `.specify/src/models.py` - Task data model
- `.specify/src/todo.py` - Business logic implementation
- `.specify/src/main.py` - Console interface
- `.specify/CLAUDE.md` - Spec-first workflow instructions