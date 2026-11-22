import React from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/common/Button';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const MyTasks = () => {
  const { tasks, loading, openCreateModal } = useTasks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" /> My Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize, search, filter, and track all your tasks with comprehensive controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} icon={Plus} size="sm">
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Filters Bar */}
      <TaskFilters />

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
            <span>Showing {tasks.length} task{tasks.length === 1 ? '' : 's'}</span>
          </div>

          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Try adjusting your search criteria or create a brand new task."
          actionLabel="Create Task"
          onAction={openCreateModal}
        />
      )}
    </div>
  );
};
