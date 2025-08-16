import express from 'express';
import {getUsername, getUserProjects, getUserData } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/projects', authMiddleware, getUserProjects);
router.get('/data', authMiddleware, getUserData);
router.get('/u/:userId', authMiddleware, getUsername);

export default router;
