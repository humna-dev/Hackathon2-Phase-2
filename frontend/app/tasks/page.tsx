'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskList } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { getLists, createList } from '@/lib/lists';
import { logout } from '@/lib/auth';
import TaskSidebar from '@/components/TaskSidebar';
import TaskListComponent from '@/components/TaskList';
import { useTaskFiltering } from '@/lib/useTaskFiltering';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedListId, setSelectedListId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { filteredTasks, groupedTasks, totalCount } = useTaskFiltering(tasks, lists, activeFilter, searchQuery);
  
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const [tasksData, listsData] = await Promise.all([
          // getTasks(), // Temporarily disabled due to backend issues
          Promise.resolve([
            {
              id: 1,
              title: 'Test Today Task',
              description: 'This should appear in Today',
              completed: false,
              due_date: new Date().toISOString().split('T')[0], // Today's date
              list_id: 1, // Work list
              user_id: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Test Upcoming Task',
              description: 'This should appear in Upcoming',
              completed: false,
              due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
              list_id: 2, // Personal list
              user_id: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 3,
              title: 'Work Task',
              description: 'This should appear in Work list',
              completed: false,
              due_date: undefined,
              list_id: 1, // Work list
              user_id: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]),
          // getLists(), // Temporarily disabled
          Promise.resolve([
            { id: 1, name: 'Work', user_id: 1, created_at: new Date().toISOString() },
            { id: 2, name: 'Personal', user_id: 1, created_at: new Date().toISOString() }
          ])
        ]);
        setTasks(tasksData);
        setLists(listsData);
      } catch (err) {
        setError('Failed to load data');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsCreating(true);
    try {
      // Create mock task locally since backend is having issues
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        due_date: dueDate || undefined,
        list_id: selectedListId || undefined,
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Creating mock task:', newTask);
      
      // Update tasks state immediately
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      // Clear form
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedListId(undefined);
      setShowCreateForm(false);
      setError('');
    } catch (err: any) {
      console.error('Task creation error:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateList = async (name: string) => {
    // Create list locally since backend is down
    const newList = { id: Date.now(), name, user_id: 1, created_at: new Date().toISOString() };
    setLists([...lists, newList]);
  };

  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Update locally since backend is down
    const updatedTask = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
  };

  const handleDeleteTask = async (id: number) => {
    // Delete locally since backend is down
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.due_date || '');
    setSelectedListId(task.list_id);
    setShowEditForm(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !editingTask) return;
    
    setIsCreating(true);
    try {
      const updatedTask = {
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        list_id: selectedListId || undefined,
        updated_at: new Date().toISOString()
      };
      
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      
      // Clear form
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedListId(undefined);
      setEditingTask(null);
      setShowEditForm(false);
      setError('');
    } catch (err: any) {
      setError('Failed to update task');
    } finally {
      setIsCreating(false);
    }
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
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {activeFilter === 'all' ? 'All Tasks' :
                 activeFilter === 'today' ? 'Today\'s Tasks' :
                 activeFilter === 'upcoming' ? 'Upcoming Tasks' :
                 activeFilter === 'completed' ? 'Completed Tasks' :
                 activeFilter === 'calendar' ? 'Calendar View' :
                 activeFilter.startsWith('list:') ? lists.find(l => l.id === parseInt(activeFilter.substring(5)))?.name || 'List' :
                 'Tasks'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{totalCount} tasks found</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <span>+</span> CREATE TASK
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-slate-400">TOTAL WORKLOAD</div>
                <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:shadow-lg group-hover:shadow-blue-400/50"></div>
              </div>
              <div className="text-2xl font-bold text-white">{tasks.length}</div>
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
              <div className="text-2xl font-bold text-white">{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <TaskListComponent
            tasks={filteredTasks}
            groupedTasks={groupedTasks}
            activeFilter={activeFilter}
            onToggleComplete={toggleTaskCompletion}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            loading={loading}
          />
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-white mb-4">CREATE NEW TASK</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
                placeholder="Task title"
                required
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none resize-none"
                placeholder="Description (optional)"
                rows={3}
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
                placeholder="Due Date"
              />

              <select
                value={selectedListId || ''}
                onChange={(e) => setSelectedListId(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="">Select List (Optional)</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>

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
                    setDueDate('');
                    setSelectedListId(undefined);
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
      {showEditForm && editingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-white mb-4">EDIT TASK</h2>
            
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
                placeholder="Task title"
                required
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none resize-none"
                placeholder="Description (optional)"
                rows={3}
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
              />

              <select
                value={selectedListId || ''}
                onChange={(e) => setSelectedListId(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="">Select List (Optional)</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium py-3 rounded-lg transition-all"
                >
                  {isCreating ? 'UPDATING...' : 'UPDATE'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingTask(null);
                    setTitle('');
                    setDescription('');
                    setDueDate('');
                    setSelectedListId(undefined);
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