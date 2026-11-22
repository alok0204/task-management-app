import { format, isToday as isDateToday, isPast, isTomorrow as isDateTomorrow, parseISO } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return 'No deadline';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'Completed') return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    // Overdue if end of day is before current time
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return isPast(endOfDay);
  } catch {
    return false;
  }
};

export const isToday = (dateString) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isDateToday(date);
  } catch {
    return false;
  }
};

export const isTomorrow = (dateString) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isDateTomorrow(date);
  } catch {
    return false;
  }
};

export const getDueDateBadge = (dateString, status) => {
  if (!dateString) return { label: 'No due date', variant: 'muted' };
  if (status === 'Completed') {
    return { label: formatDate(dateString), variant: 'neutral' };
  }
  if (isOverdue(dateString, status)) {
    return { label: `Overdue: ${formatDate(dateString)}`, variant: 'danger' };
  }
  if (isToday(dateString)) {
    return { label: 'Due Today', variant: 'warning' };
  }
  if (isTomorrow(dateString)) {
    return { label: 'Due Tomorrow', variant: 'info' };
  }
  return { label: formatDate(dateString), variant: 'neutral' };
};
