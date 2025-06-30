import express from 'express';
import { getProject, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';

const router = express.Router();

router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
