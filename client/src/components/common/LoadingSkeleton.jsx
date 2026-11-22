import React from 'react';

export const CardSkeleton = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-slate-800 rounded w-1/3" />
      <div className="h-5 bg-slate-800 rounded-full w-16" />
    </div>
    <div className="h-3 bg-slate-800/60 rounded w-3/4" />
    <div className="flex items-center gap-3 pt-2">
      <div className="h-4 bg-slate-800/70 rounded w-20" />
      <div className="h-4 bg-slate-800/70 rounded w-14" />
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-800 rounded w-16" />
          <div className="h-8 w-8 bg-slate-800 rounded-lg" />
        </div>
        <div className="h-7 bg-slate-800 rounded w-12" />
        <div className="h-2 bg-slate-800/50 rounded w-24" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl border border-slate-800 bg-slate-900/40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/2">
          <div className="w-5 h-5 rounded bg-slate-800" />
          <div className="space-y-1.5 w-3/4">
            <div className="h-4 bg-slate-800 rounded w-2/3" />
            <div className="h-3 bg-slate-800/60 rounded w-1/3" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 bg-slate-800 rounded-full" />
          <div className="h-6 w-14 bg-slate-800 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
