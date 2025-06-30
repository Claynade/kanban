import express from 'express';
import { getUserProjects, createUserProject, updateUserProject, deleteUserProject } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/', getUserProjects);
router.post('/', createUserProject);
router.put('/:id', updateUserProject);
router.delete('/:id', deleteUserProject);

export default router;
