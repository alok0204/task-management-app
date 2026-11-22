import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = CheckCircle2,
  title = 'No tasks found',
  description = 'You currently have no tasks matching this criteria.',
  actionLabel = 'Create Task',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction} icon={Plus}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
