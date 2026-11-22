import { db } from '../db/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  broadcastTaskCreated,
  broadcastTaskUpdated,
  broadcastTaskStatusChanged,
  broadcastTaskDeleted,
} from '../services/socketService.js';

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sortBy, sortOrder } = req.query;
    const tasks = await db.getTasks(req.user.id, {
      status,
      priority,
      category,
      search,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });
    return successResponse(res, 200, 'Tasks retrieved successfully', { tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await db.getTaskById(id, req.user.id);

    if (!task) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    return successResponse(res, 200, 'Task retrieved', { task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    const task = await db.createTask({
      title: title.trim(),
      description: description ? description.trim() : null,
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category || 'Work',
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    // Real-time synchronization to other tabs/sessions of this user
    broadcastTaskCreated(req.user.id, task);

    return successResponse(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, category, dueDate } = req.body;

    const existing = await db.getTaskById(id, req.user.id);
    if (!existing) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    const updatedTask = await db.updateTask(id, req.user.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description ? description.trim() : '' }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(category !== undefined && { category }),
      ...(dueDate !== undefined && { dueDate }),
    });

    broadcastTaskUpdated(req.user.id, updatedTask);

    return successResponse(res, 200, 'Task updated successfully', { task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await db.getTaskById(id, req.user.id);
    if (!existing) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    const updatedTask = await db.updateTaskStatus(id, req.user.id, status);

    broadcastTaskStatusChanged(req.user.id, updatedTask);

    return successResponse(res, 200, 'Task status updated', { task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db.getTaskById(id, req.user.id);
    if (!existing) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    await db.deleteTask(id, req.user.id);

    broadcastTaskDeleted(req.user.id, id);

    return successResponse(res, 200, 'Task deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};
