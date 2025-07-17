import express from 'express';
import { getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();
router.get('/:id/:task_id', getTask);
router.post('/:id', createTask);
router.put('/:id/:task_id', updateTask);
router.delete('/:id/:task_id', deleteTask);
export default router;