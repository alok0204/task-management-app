import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Clock,
  Trash2,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { useTasks } from '../../context/TaskContext';

export const TaskCard = ({ task }) => {
  const { updateTaskStatus, openEditModal, confirmDelete } = useTasks();
  const overdue = isOverdue(task.dueDate, task.status);
  const isCompleted = task.status === 'Completed';

  const toggleStatus = (e) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    updateTaskStatus(task.id, nextStatus);
  };

  return (
    <div
      onClick={() => openEditModal(task)}
      className={`group relative rounded-xl border p-4 bg-slate-900/60 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        overdue
          ? 'border-rose-500/30 bg-rose-950/10'
          : isCompleted
          ? 'border-emerald-500/20 opacity-80'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Quick Checkbox button */}
        <button
          type="button"
          onClick={toggleStatus}
          className={`mt-0.5 rounded-full p-0.5 transition-colors ${
            isCompleted
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-slate-500 hover:text-indigo-400'
          }`}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-medium leading-snug text-slate-100 ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Actions Menu */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => openEditModal(task)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                title="Edit Task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(task)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges Footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
            <Badge>{task.status}</Badge>
            <Badge>{task.priority}</Badge>
            <Badge>{task.category || 'General'}</Badge>

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium ml-auto ${
                  overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {overdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
