import express from 'express';
import { getUserProjects, getUserData } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/projects', getUserProjects);
router.get('/data', getUserData);

export default router;
