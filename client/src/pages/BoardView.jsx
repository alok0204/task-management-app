import React from 'react';
import { Kanban, Plus } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Button } from '../components/common/Button';
import { useTasks } from '../context/TaskContext';

export const BoardView = () => {
  const { openCreateModal } = useTasks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-400" /> Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop tasks between workflow columns to update real-time status
          </p>
        </div>

        <Button onClick={openCreateModal} icon={Plus} size="sm">
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  );
};
