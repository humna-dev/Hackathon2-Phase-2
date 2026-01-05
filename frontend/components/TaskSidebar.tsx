'use client';

import { useState, useMemo } from 'react';
import { Task, TaskList } from '@/lib/types';

interface TaskSidebarProps {
  tasks: Task[];
  lists: TaskList[];
  isOpen: boolean;
  onToggle: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateList: (name: string) => void;
  onLogout: () => void;
}

export default function TaskSidebar({
  tasks,
  lists,
  isOpen,
  onToggle,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onCreateList,
  onLogout
}: TaskSidebarProps) {
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const today = new Date();
    // Normalize today to remove time component for comparison
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Find Personal and Work lists
    const personalList = lists.find(list => list.name.toLowerCase() === 'personal');
    const workList = lists.find(list => list.name.toLowerCase() === 'work');

    return {
      all: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      today: tasks.filter(t => {
        if (!t.due_date) return false;
        // Parse the task due date and normalize it (remove time component)
        const taskDate = new Date(t.due_date);
        const taskDateNormalized = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        return taskDateNormalized.getTime() === todayNormalized.getTime();
      }).length,
      upcoming: tasks.filter(t => {
        if (!t.due_date) return false;
        // Parse the task due date and normalize it (remove time component)
        const taskDate = new Date(t.due_date);
        const taskDateNormalized = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        return taskDateNormalized.getTime() > todayNormalized.getTime();
      }).length,
      personal: personalList ? tasks.filter(t => t.list_id === personalList.id).length : 0,
      work: workList ? tasks.filter(t => t.list_id === workList.id).length : 0,
    };
  }, [tasks, lists]);

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setShowCreateList(false);
    }
  };

  const taskSections = [
    { id: 'all', label: 'All Tasks', icon: '📋', count: taskCounts.all },
    { id: 'today', label: 'Today', icon: '📅', count: taskCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: '⏰', count: taskCounts.upcoming },
    { id: 'completed', label: 'Completed', icon: '✅', count: taskCounts.completed },
    { id: 'calendar', label: 'Calendar', icon: '🗓️' }
  ];

  const specialLists = [
    { id: 'personal', label: 'Personal', icon: '🏠', count: taskCounts.personal },
    { id: 'work', label: 'Work', icon: '💼', count: taskCounts.work }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-cyan-500/20 transition-all duration-300 z-40 ${
      isOpen ? 'w-72' : 'w-16'
    }`}>
      <div className="p-4 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
          >
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isOpen && <div className="text-sm font-mono text-cyan-400">WORKSPACE</div>}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col h-full">
          <div className="p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-6">
            {/* Task Sections */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-3">TASKS</div>
              <div className="space-y-1">
                {taskSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onFilterChange(section.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
                      activeFilter === section.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-2 border-cyan-500 text-cyan-400'
                        : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </div>
                    {section.count !== undefined && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400">
                        {section.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal and Work Lists */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-3">CATEGORIES</div>
              <div className="space-y-1">
                {specialLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => onFilterChange(list.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
                      activeFilter === list.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-2 border-cyan-500 text-cyan-400'
                        : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{list.icon}</span>
                      <span>{list.label}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400">
                      {list.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Lists */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-3">LISTS</div>
              <div className="space-y-1">
                {lists.map((list) => {
                  // Skip Personal and Work lists since they're already shown in the Categories section
                  if (list.name.toLowerCase() === 'personal' || list.name.toLowerCase() === 'work') {
                    return null;
                  }
                  const count = tasks.filter(t => t.list_id === list.id).length;
                  return (
                    <button
                      key={list.id}
                      onClick={() => onFilterChange(`list:${list.id}`)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
                        activeFilter === `list:${list.id}`
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-2 border-cyan-500 text-cyan-400'
                          : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>📁</span>
                        <span>{list.name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400">
                        {count}
                      </span>
                    </button>
                  );
                })}

                {showCreateList ? (
                  <div className="flex gap-2 px-3 py-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="List name"
                      className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-sm text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                      autoFocus
                    />
                    <button onClick={handleCreateList} className="text-cyan-400 hover:text-cyan-300">✓</button>
                    <button onClick={() => setShowCreateList(false)} className="text-slate-400 hover:text-slate-300">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateList(true)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all border border-dashed border-slate-600 hover:border-cyan-500/50"
                  >
                    <span>➕</span>
                    <span>Add New List</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700/30">
            <button
              onClick={onLogout}
              className="w-full px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
            >
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}