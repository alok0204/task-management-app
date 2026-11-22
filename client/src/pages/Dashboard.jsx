import React from 'react';
import { format } from 'date-fns';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/tasks/TaskCard';
import { CardSkeleton, StatsSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { isToday, isOverdue } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, openCreateModal } = useTasks();

  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  // Computed sections
  const todayTasks = tasks.filter((t) => isToday(t.dueDate));
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'Completed' && t.dueDate && !isOverdue(t.dueDate, t.status))
    .slice(0, 4);
  const recentTasks = tasks.slice(0, 5);

  const total = stats?.total ?? tasks.length;
  const completed = stats?.completed ?? tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = stats?.inProgress ?? tasks.filter((t) => t.status === 'In Progress').length;
  const pending = stats?.pending ?? tasks.filter((t) => t.status === 'Pending').length;
  const overdue = stats?.overdue ?? overdueTasks.length;
  const completionRate = stats?.completionRate ?? (total > 0 ? Math.round((completed / total) * 100) : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Productivity Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hello, {user?.name || 'Alok'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{todayStr}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} icon={Plus} size="md">
            Add New Task
          </Button>
        </div>
      </div>

      {/* 5 Statistics KPI Cards */}
      {loading && !stats ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Total Tasks */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Total Tasks</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-white">{total}</div>
            <p className="mt-1 text-[11px] text-slate-400">All registered tasks</p>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-emerald-400">{completed}</div>
            <p className="mt-1 text-[11px] text-emerald-500/80">{completionRate}% finished</p>
          </div>

          {/* In Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">In Progress</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-indigo-400">{inProgress}</div>
            <p className="mt-1 text-[11px] text-slate-400">Currently active</p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Pending</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-amber-400">{pending}</div>
            <p className="mt-1 text-[11px] text-slate-400">Queued for action</p>
          </div>

          {/* Overdue */}
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Overdue</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3 text-2xl font-bold text-rose-400">{overdue}</div>
            <p className="mt-1 text-[11px] text-rose-400/80">
              {overdue > 0 ? 'Urgent attention' : 'No overdue tasks'}
            </p>
          </div>
        </div>
      )}

      {/* Completion Overview Progress Bar */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-indigo-950/20 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Overall Completion Progress</h3>
          </div>
          <span className="text-xs font-bold text-indigo-400">
            {completed} of {total} completed ({completionRate}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Task Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" /> Today's Focus
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {todayTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {todayTasks.slice(0, 4).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {todayTasks.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-xs text-slate-400">
                No tasks specifically due today. Great time to get ahead!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Upcoming Deadlines
            </h2>
            <Link
              to="/tasks"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {upcomingTasks.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-xs text-slate-400">
                No upcoming scheduled tasks.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Recent Activity</h2>
            <p className="text-xs text-slate-400">Your latest updated or created tasks</p>
          </div>
          <Link
            to="/tasks"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            All Tasks <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {recentTasks.length === 0 && (
            <EmptyState
              title="No tasks yet"
              description="Get started by creating your first task in TaskFlow."
              actionLabel="Create First Task"
              onAction={openCreateModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};
