import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PieChart,
  BarChart3,
  ListTodo,
} from 'lucide-react';

export const AnalyticsCharts = ({ stats }) => {
  if (!stats || stats.total === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
        <PieChart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No Task Analytics Yet</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
          Create and complete tasks to start generating productivity metrics and performance insights.
        </p>
      </div>
    );
  }

  const {
    total = 0,
    completed = 0,
    inProgress = 0,
    pending = 0,
    overdue = 0,
    completionRate = 0,
    priorityCounts = {},
    categoryCounts = {},
    activityTrends = [],
  } = stats;

  const highPriority = priorityCounts.High || 0;
  const medPriority = priorityCounts.Medium || 0;
  const lowPriority = priorityCounts.Low || 0;

  // Maximum count for scaling trend bars
  const maxTrend = Math.max(...activityTrends.map((d) => Math.max(d.created, d.completed, 1)), 1);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{completionRate}%</div>
          <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{completed}</div>
          <p className="mt-2 text-xs text-slate-400">Out of {total} total tasks</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>In Progress & Pending</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{inProgress + pending}</div>
          <p className="mt-2 text-xs text-slate-400">
            {inProgress} active, {pending} pending
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400">{overdue}</div>
          <p className="mt-2 text-xs text-slate-400">
            {overdue > 0 ? 'Requires immediate attention' : 'All deadlines on track'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" /> Status Distribution
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
                </span>
                <span>
                  {completed} ({total ? Math.round((completed / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> In Progress
                </span>
                <span>
                  {inProgress} ({total ? Math.round((inProgress / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${total ? (inProgress / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
                </span>
                <span>
                  {pending} ({total ? Math.round((pending / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${total ? (pending / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Priority Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Priority
                </span>
                <span>
                  {highPriority} ({total ? Math.round((highPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${total ? (highPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Priority
                </span>
                <span>
                  {medPriority} ({total ? Math.round((medPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${total ? (medPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Low Priority
                </span>
                <span>
                  {lowPriority} ({total ? Math.round((lowPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${total ? (lowPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Trends */}
      {activityTrends.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> 7-Day Productivity Trends
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-indigo-500" /> Created
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Completed
              </span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-800">
            {activityTrends.map((item) => {
              const createdHeight = (item.created / maxTrend) * 100;
              const completedHeight = (item.completed / maxTrend) * 100;

              return (
                <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Created Bar */}
                    <div
                      title={`${item.created} created`}
                      className="w-3.5 sm:w-5 bg-indigo-500/80 hover:bg-indigo-400 rounded-t-md transition-all duration-300"
                      style={{ height: `${Math.max(createdHeight, 4)}%` }}
                    />
                    {/* Completed Bar */}
                    <div
                      title={`${item.completed} completed`}
                      className="w-3.5 sm:w-5 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-md transition-all duration-300"
                      style={{ height: `${Math.max(completedHeight, 4)}%` }}
                    />
                  </div>
                  <span className="mt-2 text-[11px] font-medium text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
