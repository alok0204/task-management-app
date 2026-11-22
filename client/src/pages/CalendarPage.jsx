import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { CalendarView } from '../components/calendar/CalendarView';
import { Button } from '../components/common/Button';
import { useTasks } from '../context/TaskContext';

export const CalendarPage = () => {
  const { openCreateModal } = useTasks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" /> Calendar Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track deadlines, organize milestone timelines, and inspect daily tasks
          </p>
        </div>

        <Button onClick={openCreateModal} icon={Plus} size="sm">
          Add Task
        </Button>
      </div>

      {/* Calendar View Component */}
      <CalendarView />
    </div>
  );
};
