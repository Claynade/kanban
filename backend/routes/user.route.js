import express from 'express';
import {getUsername, getUserProjects, getUserData } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/u/:userId', getUsername);
router.get('/projects', getUserProjects);
router.get('/data', getUserData);

export default router;
