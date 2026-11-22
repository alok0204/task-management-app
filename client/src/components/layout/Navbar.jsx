import React from 'react';
import { Menu, Sun, Moon, Plus, Search, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';
import { Button } from '../common/Button';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { filters, setFilters, openCreateModal } = useTasks();

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks, descriptions..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Thiranex Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Thiranex Task 2</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick Add Task */}
        <Button onClick={openCreateModal} size="sm" icon={Plus}>
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>
    </header>
  );
};
