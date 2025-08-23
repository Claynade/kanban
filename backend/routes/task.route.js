import express from 'express';
import { getTask, createTask, updateTask, deleteTask, getTasksForProject } from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/:id/:task_id', authMiddleware, getTask);
router.post('/:id', authMiddleware, createTask);
router.put('/:id/:task_id', authMiddleware, updateTask);
router.delete('/:id/:task_id', authMiddleware, deleteTask);
router.get('/:id', authMiddleware, getTasksForProject);
export default router;