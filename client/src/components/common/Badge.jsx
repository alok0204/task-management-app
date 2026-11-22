import React from 'react';

const statusConfig = {
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'In Progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const priorityConfig = {
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const categoryConfig = {
  Work: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Study: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Personal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';

  if (statusConfig[children]) {
    style = statusConfig[children];
  } else if (priorityConfig[children]) {
    style = priorityConfig[children];
  } else if (categoryConfig[children]) {
    style = categoryConfig[children];
  } else if (variant === 'danger') {
    style = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (variant === 'warning') {
    style = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (variant === 'success') {
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (variant === 'info') {
    style = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
};
