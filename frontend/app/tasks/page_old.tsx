'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { logout } from '@/lib/auth';
import TaskSidebar from '@/components/TaskSidebar';
import TaskList from '@/components/TaskList';
import { useTaskFiltering } from '@/lib/useTaskFiltering';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        try {
          const data = await getTasks();
          setTasks(data);
        } catch (err) {
          setError('Failed to load tasks');
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadTasks();
  }, [router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsCreating(true);
    try {
      const newTask = await createTask({ title, description });
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const updatedTask = await updateTask(id, {
        completed: !task.completed
      });

      setTasks(tasks.map(t =>
        t.id === id ? updatedTask : t
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Use the filtering hook
  const { filteredTasks, groupedTasks, totalCount, completedCount } = useTaskFiltering(tasks, activeFilter, searchQuery);
  
  const totalTasks = tasks.length;
  const focusScore = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 font-mono">LOADING WORKSPACE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Enhanced Sidebar */}
      <TaskSidebar
        tasks={tasks}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-16'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {activeFilter === 'all' ? 'All Tasks' :
                 activeFilter === 'today' ? 'Today\'s Tasks' :
                 activeFilter === 'upcoming' ? 'Upcoming Tasks' :
                 activeFilter === 'completed' ? 'Completed Tasks' :
                 activeFilter === 'calendar' ? 'Calendar View' :
                 activeFilter === 'personal' ? 'Personal Tasks' :
                 activeFilter === 'work' ? 'Work Tasks' :
                 activeFilter.startsWith('tag:') ? `#${activeFilter.substring(4)} Tasks` :
                 'Tasks'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {searchQuery ? `Showing ${totalCount} filtered results` : `${totalCount} tasks found`}
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              CREATE TASK
            </button>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-slate-400">TOTAL WORKLOAD</div>
                <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:shadow-lg group-hover:shadow-blue-400/50"></div>
              </div>
              <div className="text-2xl font-bold text-white">{totalTasks}</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-green-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-slate-400">COMPLETED ACTIONS</div>
                <div className="w-2 h-2 rounded-full bg-green-400 group-hover:shadow-lg group-hover:shadow-green-400/50"></div>
              </div>
              <div className="text-2xl font-bold text-white">{tasks.filter(t => t.completed).length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-orange-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-slate-400">FILTERED RESULTS</div>
                <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:shadow-lg group-hover:shadow-orange-400/50"></div>
              </div>
              <div className="text-2xl font-bold text-white">{totalCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-slate-400">FOCUS SCORE</div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-400/50"></div>
              </div>
              <div className="text-2xl font-bold text-white">{focusScore}%</div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            groupedTasks={groupedTasks}
            activeFilter={activeFilter}
            onToggleComplete={toggleTaskCompletion}
            onDeleteTask={handleDeleteTask}
            loading={loading}
          />
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-white mb-4">CREATE NEW TASK</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                  placeholder="Description (optional) - Add tags like #urgent, #work, #personal"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium py-3 rounded-lg transition-all"
                >
                  {isCreating ? 'CREATING...' : 'CREATE'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setTitle('');
                    setDescription('');
                    setError('');
                  }}
                  className="px-6 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium py-3 rounded-lg transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
