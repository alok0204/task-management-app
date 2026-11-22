import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday as isDateToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Badge } from '../common/Badge';

export const CalendarView = () => {
  const { tasks, openEditModal, openCreateModal } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Filter tasks for the selected date
  const selectedDateTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    return isSameDay(new Date(t.dueDate), selectedDate);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Calendar Month Grid */}
      <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={goToToday}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 pb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isDateToday(day);

            // Tasks due on this day
            const dayTasks = tasks.filter((t) => {
              if (!t.dueDate) return false;
              return isSameDay(new Date(t.dueDate), day);
            });

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[90px] p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                    : isCurrentMonth
                    ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-900 bg-slate-950/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isTodayDate
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'text-indigo-400 font-bold'
                        : isCurrentMonth
                        ? 'text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Mini task indicators */}
                <div className="mt-1 space-y-1 overflow-hidden max-h-[50px]">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(t);
                      }}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                        t.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-indigo-500/15 text-indigo-300'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[9px] text-slate-400 pl-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Sidebar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Selected Date</span>
            <h3 className="text-base font-bold text-slate-100">
              {format(selectedDate, 'EEEE, MMM d')}
            </h3>
          </div>
          <button
            onClick={openCreateModal}
            className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            title="Create task for this day"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {selectedDateTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => openEditModal(t)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 cursor-pointer space-y-2 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                  {t.title}
                </h4>
                <Badge>{t.priority}</Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <Badge>{t.status}</Badge>
                <span>{t.category}</span>
              </div>
            </div>
          ))}

          {selectedDateTasks.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              <CalendarIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              No tasks due on this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
