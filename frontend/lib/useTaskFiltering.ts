import { useMemo } from 'react';
import { Task, TaskList } from '@/lib/types';

export function useTaskFiltering(tasks: Task[], activeFilter: string, searchQuery: string, lists: TaskList[] = []) {
  const filteredTasks = useMemo(() => {
    console.log('Filtering tasks:', { tasks: tasks.length, activeFilter, searchQuery }); // Debug log
    
    let filtered = [...tasks];

    // Apply search filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply sidebar filter
    if (activeFilter && activeFilter !== 'all') {
      const today = new Date();
      // Normalize today to remove time component for comparison
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      console.log('Today normalized for comparison:', todayNormalized.toISOString().split('T')[0]); // Debug log

      switch (activeFilter) {
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;

        case 'today':
          filtered = filtered.filter(task => {
            if (!task.due_date) return false;
            // Parse the task due date and normalize it (remove time component)
            const taskDate = new Date(task.due_date);
            const taskDateNormalized = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
            console.log('Comparing dates - task:', taskDateNormalized.toISOString().split('T')[0], 'today:', todayNormalized.toISOString().split('T')[0]);
            return taskDateNormalized.getTime() === todayNormalized.getTime();
          });
          break;

        case 'upcoming':
          filtered = filtered.filter(task => {
            if (!task.due_date) return false;
            // Parse the task due date and normalize it (remove time component)
            const taskDate = new Date(task.due_date);
            const taskDateNormalized = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
            return taskDateNormalized.getTime() > todayNormalized.getTime();
          });
          break;
        
        case 'calendar':
          filtered = filtered.filter(task => task.due_date);
          break;
        
        case 'personal':
          const personalList = lists.find(list => list.name.toLowerCase() === 'personal');
          if (personalList) {
            console.log('Filtering by Personal list ID:', personalList.id);
            filtered = filtered.filter(task => {
              console.log('Task list_id:', task.list_id, 'Personal list ID:', personalList.id);
              return task.list_id === personalList.id;
            });
          }
          break;
        
        case 'work':
          const workList = lists.find(list => list.name.toLowerCase() === 'work');
          if (workList) {
            console.log('Filtering by Work list ID:', workList.id);
            filtered = filtered.filter(task => {
              console.log('Task list_id:', task.list_id, 'Work list ID:', workList.id);
              return task.list_id === workList.id;
            });
          }
          break;
        
        default:
          if (activeFilter.startsWith('list:')) {
            const listId = parseInt(activeFilter.substring(5));
            filtered = filtered.filter(task => task.list_id === listId);
          }
          else if (activeFilter.startsWith('tag:')) {
            const tag = activeFilter.substring(4).toLowerCase();
            filtered = filtered.filter(task => {
              const text = `${task.title} ${task.description || ''}`.toLowerCase();
              return text.includes(tag) || text.includes(`#${tag}`);
            });
          }
          break;
      }
    }

    console.log('Filtered tasks result:', filtered.length); // Debug log
    return filtered;
  }, [tasks, lists, activeFilter, searchQuery]);

  // Group tasks by date for calendar view
  const groupedTasks = useMemo(() => {
    if (activeFilter !== 'calendar') return null;

    const groups: { [key: string]: Task[] } = {};
    
    filteredTasks.forEach(task => {
      if (!task.due_date) return;
      
      const date = new Date(task.due_date);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    // Sort groups by date
    const sortedGroups = Object.entries(groups)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc, [date, tasks]) => {
        acc[date] = tasks.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return acc;
      }, {} as { [key: string]: Task[] });

    return sortedGroups;
  }, [filteredTasks, activeFilter]);

  return {
    filteredTasks,
    groupedTasks,
    totalCount: filteredTasks.length,
    completedCount: filteredTasks.filter(t => t.completed).length
  };
}