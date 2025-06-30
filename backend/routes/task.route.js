import express from 'express';
import { getTask, createTask, updateTask } from '../controllers/task.controller.js';

const router = express.Router();
router.get('/:id', getTask);
router.post('/:id', createTask);
router.put('/:id', updateTask);
export default router;