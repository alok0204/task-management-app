import React from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const TaskFilters = () => {
  const { filters, setFilters } = useTasks();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'All',
      priority: 'All',
      category: 'All',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.category !== 'All' ||
    filters.search !== '' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
      <div className="flex items-center gap-1.5 text-slate-400 font-medium pl-1">
        <Filter className="w-3.5 h-3.5 text-indigo-400" />
        <span>Filter:</span>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="All">All Categories</option>
        <option value="Work">Work</option>
        <option value="Study">Study</option>
        <option value="Personal">Personal</option>
        <option value="Other">Other</option>
      </select>

      {/* Sort Section */}
      <div className="flex items-center gap-1.5 text-slate-400 font-medium ml-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
        <span>Sort:</span>
      </div>

      <select
        value={filters.sortBy}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        className="rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="createdAt">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Alphabetical</option>
      </select>

      <button
        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white"
        title="Toggle sort direction"
      >
        {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};
