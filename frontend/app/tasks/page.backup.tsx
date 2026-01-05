'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskList } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { logout } from '@/lib/auth';
import TaskSidebar from '@/components/TaskSidebar';
import TaskListComponent from '@/components/TaskList';
import { useTaskFiltering } from '@/lib/useTaskFiltering';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch {
        // Fallback demo data
        setTasks([{
          id: 1,
          title: 'Sample Task',
          description: 'Demo task',
          completed: false,
          due_date: new Date().toISOString().split('T')[0],
          list_id: 1,
          user_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      }
      
      setLists([
        { id: 1, name: 'Work', user_id: 1, created_at: new Date().toISOString() },
        { id: 2, name: 'Personal', user_id: 1, created_at: new Date().toISOString() }
      ]);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleCreateList = (name: string) => {
    const newList = { id: Date.now(), name, user_id: 1, created_at: new Date().toISOString() };
    setLists([...lists, newList]);
  };

  const { filteredTasks, groupedTasks, totalCount } = useTaskFiltering(tasks, activeFilter, searchQuery, lists);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 font-mono">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <TaskSidebar
        tasks={tasks}
        lists={lists}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateList={handleCreateList}
        onLogout={handleLogout}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-16'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-cyan-400 mb-4">Tasks Dashboard</h1>
          <TaskListComponent
            tasks={filteredTasks}
            groupedTasks={groupedTasks}
            activeFilter={activeFilter}
            onToggleComplete={() => {}}
            onDeleteTask={() => {}}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
