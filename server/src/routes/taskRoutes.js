import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskStatus,
} from '../validators/taskValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateTaskCreate, createTask);
router.put('/:id', validateTaskUpdate, updateTask);
router.patch('/:id/status', validateTaskStatus, updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
