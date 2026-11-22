import React from 'react';
import { BarChart2, RefreshCw } from 'lucide-react';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { useTasks } from '../context/TaskContext';

export const AnalyticsPage = () => {
  const { stats, fetchStats, loading } = useTasks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" /> Analytics & Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics, completion rates, and historical productivity trends
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts stats={stats} />
    </div>
  );
};
