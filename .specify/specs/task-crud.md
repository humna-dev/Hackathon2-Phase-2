# Task CRUD Specification

## Task Model Definition

A Task entity has the following properties:
- `id`: Integer, unique identifier for the task
- `title`: String, the title of the task (required, non-empty)
- `description`: String, optional description of the task (can be empty)
- `completed`: Boolean, indicates whether the task is completed (default: False)

## User Stories

### Add Task
**As a** user
**I want** to add a new task with a title and optional description
**So that** I can keep track of things I need to do

#### Acceptance Criteria:
- User can input a title for the task
- User can optionally input a description for the task
- The task gets assigned a unique ID
- The task is marked as not completed by default
- The task appears in the task list
- If title is empty, the system shows an error message and does not create the task

### View Tasks
**As a** user
**I want** to see a list of all my tasks
**So that** I can understand what I need to do and what I have completed

#### Acceptance Criteria:
- All tasks are displayed with their ID, title, and completion status
- Completed tasks are clearly marked as completed
- If there are no tasks, a message indicates this
- The list updates in real-time as tasks are added/modified

### Update Task
**As a** user
**I want** to update the title and description of an existing task
**So that** I can keep my tasks up to date with changing requirements

#### Acceptance Criteria:
- User can select a task by its ID
- User can change the title of the task
- User can change the description of the task
- Changes are saved and reflected in the task list
- If the specified task ID doesn't exist, an error message is shown

### Delete Task
**As a** user
**I want** to remove tasks I no longer need
**So that** my task list remains relevant and uncluttered

#### Acceptance Criteria:
- User can select a task by its ID for deletion
- The task is removed from the task list
- The deletion is confirmed to the user
- If the specified task ID doesn't exist, an error message is shown

### Toggle Complete
**As a** user
**I want** to mark tasks as completed or incomplete
**So that** I can track my progress

#### Acceptance Criteria:
- User can select a task by its ID to toggle its completion status
- If the task was incomplete, it becomes completed
- If the task was completed, it becomes incomplete
- The change is reflected in the task list immediately
- If the specified task ID doesn't exist, an error message is shown