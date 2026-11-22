import { apiRequest } from './api';

export const taskService = {
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const qs = query.toString();
    const endpoint = `/tasks${qs ? `?${qs}` : ''}`;
    const res = await apiRequest(endpoint);
    return res.data?.tasks || [];
  },

  async getTaskById(id) {
    const res = await apiRequest(`/tasks/${id}`);
    return res.data?.task;
  },

  async createTask(taskData) {
    const res = await apiRequest('/tasks', {
      method: 'POST',
      body: taskData,
    });
    return res.data?.task;
  },

  async updateTask(id, taskData) {
    const res = await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: taskData,
    });
    return res.data?.task;
  },

  async updateTaskStatus(id, status) {
    const res = await apiRequest(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return res.data?.task;
  },

  async deleteTask(id) {
    const res = await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.data?.id;
  },

  async getStats() {
    const res = await apiRequest('/stats');
    return res.data?.stats;
  },
};
