import React, { useState } from 'react';
import { Plus, ArrowRight, ArrowLeft, CheckCircle2, Circle, Clock, Flame } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/dateUtils';

const COLUMNS = [
  { id: 'Pending', label: 'Pending', color: 'border-amber-500/40 bg-amber-500/5', icon: Circle },
  { id: 'In Progress', label: 'In Progress', color: 'border-indigo-500/40 bg-indigo-500/5', icon: Clock },
  { id: 'Completed', label: 'Completed', color: 'border-emerald-500/40 bg-emerald-500/5', icon: CheckCircle2 },
];

export const KanbanBoard = () => {
  const { tasks, updateTaskStatus, openEditModal, openCreateModal, confirmDelete } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== columnId) {
        await updateTaskStatus(taskId, columnId);
      }
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;
        const isHovered = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col rounded-2xl border p-4 transition-all duration-200 min-h-[550px] ${
              column.color
            } ${
              isHovered
                ? 'ring-2 ring-indigo-500 bg-indigo-500/10 border-indigo-500'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-200">{column.label}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={openCreateModal}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                title={`Add task in ${column.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards in Column */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {columnTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                const isDragging = draggedTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => openEditModal(task)}
                    className={`group relative rounded-xl border p-3.5 bg-slate-900/90 hover:bg-slate-800/90 transition-all duration-150 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md ${
                      isDragging ? 'opacity-40 scale-95 border-indigo-500' : 'border-slate-800'
                    } ${overdue ? 'border-l-4 border-l-rose-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-slate-100 leading-snug">
                        {task.title}
                      </h4>
                      <Badge>{task.priority}</Badge>
                    </div>

                    {task.description && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] text-slate-400">{task.category || 'General'}</span>
                      {task.dueDate && (
                        <span
                          className={`text-[11px] ${
                            overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    {/* Quick Move Status Buttons on Card Hover */}
                    <div
                      className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {column.id !== 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(task.id, 'Pending')}
                          className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-amber-400"
                          title="Move to Pending"
                        >
                          <ArrowLeft className="w-3 h-3" /> Pending
                        </button>
                      ) : <span />}

                      {column.id === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(task.id, 'In Progress')}
                          className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 ml-auto"
                          title="Move to In Progress"
                        >
                          In Progress <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {column.id === 'In Progress' && (
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="text-[10px] flex items-center gap-1 text-emerald-400 hover:text-emerald-300 ml-auto"
                          title="Move to Completed"
                        >
                          Complete <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="h-32 rounded-xl border border-dashed border-slate-800/70 flex items-center justify-center text-xs text-slate-400">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
