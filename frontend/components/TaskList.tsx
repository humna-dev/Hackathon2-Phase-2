'use client';

import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  groupedTasks?: { [key: string]: Task[] } | null;
  activeFilter: string;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask?: (task: Task) => void;
  loading?: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask?: (task: Task) => void;
}

function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }: TaskItemProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/30 transition-all group">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="flex-shrink-0"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/25' 
              : 'border-slate-500 hover:border-cyan-400'
          }`}>
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 ${
            task.completed ? 'line-through text-slate-500' : 'text-white'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm ${
              task.completed ? 'line-through text-slate-600' : 'text-slate-300'
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-mono text-slate-500">
              {new Date(task.created_at).toLocaleDateString()}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              task.completed ? 'bg-green-400' : 'bg-orange-400'
            }`}></div>
          </div>
        </div>

        <button
          onClick={() => onDeleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        
        <button
          onClick={() => onEditTask && onEditTask(task)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-400 transition-all p-2 mr-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function TaskList({ 
  tasks, 
  groupedTasks, 
  activeFilter, 
  onToggleComplete, 
  onDeleteTask,
  onEditTask,
  loading = false 
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-cyan-400 font-mono">LOADING TASKS...</div>
      </div>
    );
  }

  // Calendar view
  if (activeFilter === 'calendar' && groupedTasks) {
    const groupEntries = Object.entries(groupedTasks);
    
    if (groupEntries.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-mono text-sm">NO SCHEDULED TASKS</p>
          <p className="text-slate-500 text-xs mt-1">Tasks will appear here grouped by date</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groupEntries.map(([date, dateTasks]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
              <h3 className="text-lg font-semibold text-white">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
              <span className="text-xs font-mono text-slate-400">
                {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3 ml-6">
              {dateTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Regular list view
  if (tasks.length === 0) {
    const getEmptyStateMessage = () => {
      switch (activeFilter) {
        case 'completed':
          return { title: 'NO COMPLETED TASKS', subtitle: 'Complete some tasks to see them here' };
        case 'today':
          return { title: 'NO TASKS FOR TODAY', subtitle: 'Create tasks to get started' };
        case 'upcoming':
          return { title: 'NO UPCOMING TASKS', subtitle: 'Schedule future tasks to see them here' };
        case 'personal':
          return { title: 'NO PERSONAL TASKS', subtitle: 'Add tasks with "personal" to see them here' };
        case 'work':
          return { title: 'NO WORK TASKS', subtitle: 'Add work-related tasks to see them here' };
        default:
          if (activeFilter.startsWith('tag:')) {
            const tag = activeFilter.substring(4);
            return { title: `NO TASKS WITH #${tag.toUpperCase()}`, subtitle: 'Add tasks with this tag to see them here' };
          }
          return { title: 'NO ACTIVE TASKS', subtitle: 'Initialize your first task to begin' };
      }
    };

    const { title, subtitle } = getEmptyStateMessage();

    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-400 font-mono text-sm">{title}</p>
        <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
}