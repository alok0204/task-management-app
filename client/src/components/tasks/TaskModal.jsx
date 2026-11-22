import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTasks } from '../../context/TaskContext';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const CATEGORY_OPTIONS = ['Work', 'Study', 'Personal', 'Other'];

export const TaskModal = () => {
  const { activeTaskModal, closeTaskModal, createTask, updateTask } = useTasks();
  const { isOpen, task } = activeTaskModal;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    category: 'Work',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        category: task.category || 'Work',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        category: 'Work',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      if (task?.id) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      closeTaskModal();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeTaskModal}
      title={task ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errors.form}
          </div>
        )}

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Complete database indexing report"
          error={errors.title}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add detailed task notes, sub-items, or context..."
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={closeTaskModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
