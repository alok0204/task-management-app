import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socketService';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTaskModal, setActiveTaskModal] = useState({ isOpen: false, task: null });
  const [activeDeleteModal, setActiveDeleteModal] = useState({ isOpen: false, task: null });
  const [notification, setNotification] = useState(null);

  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    category: 'All',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === curr?.id ? null : curr));
    }, 4000);
  }, []);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const statsData = await taskService.getStats();
      setStats(statsData);
    } catch (err) {
      console.warn('Failed to load stats:', err.message);
    }
  }, [isAuthenticated]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const taskList = await taskService.getTasks(filters);
      setTasks(taskList);
      await fetchStats();
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showNotification(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters, fetchStats, showNotification]);

  // Load tasks on mount or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [isAuthenticated, filters, fetchTasks]);

  // Real-time synchronization with Socket.IO
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) return;

    const handleCreated = (newTask) => {
      setTasks((prev) => {
        if (prev.some((t) => t.id === newTask.id)) return prev;
        return [newTask, ...prev];
      });
      fetchStats();
      showNotification(`Task "${newTask.title}" added`, 'success');
    };

    const handleUpdated = (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      fetchStats();
    };

    const handleStatusChanged = (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      fetchStats();
      if (updatedTask.status === 'Completed') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    };

    const handleDeleted = ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      fetchStats();
      showNotification('Task deleted', 'info');
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:status_changed', handleStatusChanged);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:status_changed', handleStatusChanged);
      socket.off('task:deleted', handleDeleted);
    };
  }, [isAuthenticated, fetchStats, showNotification]);

  // Task CRUD actions
  const createTask = async (taskData) => {
    const newTask = await taskService.createTask(taskData);
    setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
    fetchStats();
    showNotification('Task created successfully!', 'success');
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    const updated = await taskService.updateTask(id, taskData);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    fetchStats();
    showNotification('Task updated successfully!', 'success');
    return updated;
  };

  const updateTaskStatus = async (id, status) => {
    // Optimistic UI update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (status === 'Completed') {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 },
      });
    }

    try {
      const updated = await taskService.updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      fetchStats();
      showNotification(`Task marked as ${status}`, 'success');
      return updated;
    } catch (err) {
      fetchTasks(); // rollback on error
      showNotification(err.message || 'Failed to update status', 'error');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      fetchStats();
      showNotification('Task removed', 'info');
    } catch (err) {
      showNotification(err.message || 'Failed to delete task', 'error');
      throw err;
    }
  };

  const openCreateModal = () => setActiveTaskModal({ isOpen: true, task: null });
  const openEditModal = (task) => setActiveTaskModal({ isOpen: true, task });
  const closeTaskModal = () => setActiveTaskModal({ isOpen: false, task: null });

  const confirmDelete = (task) => setActiveDeleteModal({ isOpen: true, task });
  const closeDeleteModal = () => setActiveDeleteModal({ isOpen: false, task: null });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        filters,
        setFilters,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        activeTaskModal,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        activeDeleteModal,
        confirmDelete,
        closeDeleteModal,
        notification,
        showNotification,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
