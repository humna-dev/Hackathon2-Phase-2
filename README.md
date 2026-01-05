# 🚀 Hackathon II - Phase 2: Full-Stack Todo Application

A modern, feature-rich todo application built with **FastAPI** backend and **Next.js** frontend, featuring advanced task management, smart filtering, and a sleek dark UI.

![Todo App Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)

## ✨ Features

### 🎯 **Core Functionality**
- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **User Authentication** - JWT-based secure login/register system
- ✅ **Task Management** - Full task lifecycle management
- ✅ **Real-time Updates** - Instant UI updates without page refresh

### 📅 **Smart Task Organization**
- 🗓️ **Due Date Management** - Set and track task deadlines
- 📋 **Custom Lists** - Create Personal, Work, and custom task lists
- 🔍 **Advanced Filtering** - Filter by Today, Upcoming, Completed, Lists
- 📊 **Calendar View** - Tasks grouped by due dates
- 🏷️ **Tag System** - Organize tasks with hashtags

### 🎨 **Modern UI/UX**
- 🌙 **Dark Theme** - Sleek cyberpunk-inspired design
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Smooth Animations** - Fluid transitions and hover effects
- 🎛️ **Collapsible Sidebar** - Space-efficient navigation
- 📈 **Dashboard Widgets** - Real-time task statistics

### 🔧 **Technical Features**
- 🔐 **Secure Authentication** - JWT tokens with proper validation
- 🗄️ **PostgreSQL Database** - Robust data persistence
- 🌐 **RESTful API** - Clean, documented API endpoints
- 🎯 **TypeScript** - Full type safety across the stack
- 🚀 **Production Ready** - Optimized for deployment

## 🏗️ Tech Stack

### **Backend**
- **FastAPI** - High-performance Python web framework
- **SQLModel** - Modern SQL database toolkit
- **PostgreSQL** - Reliable relational database
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation and serialization
- **Uvicorn** - Lightning-fast ASGI server

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management
- **Fetch API** - HTTP client for API calls

### **Database Schema**
```sql
Users: id, username, email, password, created_at
Tasks: id, title, description, completed, due_date, list_id, user_id, created_at, updated_at
TaskLists: id, name, user_id, created_at
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **PostgreSQL** (or use the provided Neon DB)

### 1. Clone the Repository
```bash
git clone https://github.com/humna-dev/Hackathon2-Phase-2.git
cd Hackathon2-Phase-2
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Environment variables are already configured in .env
# Database: PostgreSQL (Neon DB)
# JWT Secret: Pre-configured

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Environment variables are pre-configured in .env.local
# API URL: http://localhost:8000

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📱 Usage Guide

### **Getting Started**
1. **Register** a new account or **Login** with existing credentials
2. **Create your first task** using the "CREATE TASK" button
3. **Set due dates** and **assign to lists** for better organization
4. **Use the sidebar** to filter and navigate your tasks

### **Task Management**
- **Create**: Click "CREATE TASK" → Fill details → Select due date & list
- **Edit**: Hover over task → Click edit icon → Modify details
- **Complete**: Click the checkbox to mark tasks as done
- **Delete**: Hover over task → Click delete icon

### **Smart Filtering**
- **All Tasks**: View all your tasks
- **Today**: Tasks due today
- **Upcoming**: Tasks with future due dates
- **Completed**: Finished tasks
- **Work/Personal**: Tasks in specific lists
- **Calendar**: Tasks grouped by due date

### **List Management**
- **Create Lists**: Use "Add New List" in sidebar
- **Assign Tasks**: Select list when creating/editing tasks
- **Filter by List**: Click on any list in sidebar

## 🎯 API Endpoints

### **Authentication**
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - User login
```

### **Tasks**
```
GET    /api/tasks        - Get all user tasks
POST   /api/tasks        - Create new task
PUT    /api/tasks/{id}   - Update task
DELETE /api/tasks/{id}   - Delete task
```

### **Lists**
```
GET    /api/lists        - Get all user lists
POST   /api/lists        - Create new list
DELETE /api/lists/{id}   - Delete list
```

## 🎨 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400/1e293b/64748b?text=Modern+Dark+Dashboard)

### Task Management
![Task Management](https://via.placeholder.com/800x400/0f172a/475569?text=Smart+Task+Filtering)

### Mobile Responsive
![Mobile View](https://via.placeholder.com/400x600/1e293b/64748b?text=Mobile+Responsive)

## 🔧 Development

### **Project Structure**
```
Hackathon2-Phase-2/
├── backend/
│   ├── app/
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── routes/        # API endpoints
│   │   ├── main.py        # FastAPI app
│   │   └── config.py      # Configuration
│   └── requirements.txt
├── frontend/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities & API calls
│   └── package.json
└── README.md
```

### **Key Components**
- **TaskSidebar**: Smart navigation with filtering
- **TaskList**: Dynamic task display with grouping
- **TaskItem**: Individual task with actions
- **useTaskFiltering**: Custom hook for task filtering logic

## 🚀 Deployment

### **Backend Deployment**
```bash
# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Or use Docker
docker build -t todo-backend .
docker run -p 8000:8000 todo-backend
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Humna Dev**
- GitHub: [@humna-dev](https://github.com/humna-dev)
- Project: [Hackathon2-Phase-2](https://github.com/humna-dev/Hackathon2-Phase-2)

## 🙏 Acknowledgments

- **FastAPI** team for the amazing framework
- **Next.js** team for the powerful React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Neon** for the PostgreSQL database hosting

---

⭐ **Star this repository if you found it helpful!**

🐛 **Found a bug?** [Open an issue](https://github.com/humna-dev/Hackathon2-Phase-2/issues)

💡 **Have a feature request?** [Start a discussion](https://github.com/humna-dev/Hackathon2-Phase-2/discussions)