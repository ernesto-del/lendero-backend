// LENDERO HUACHI - Auth Routes

import express from 'express';
import { login, logout, me } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', login);

// POST /api/v1/auth/logout
router.post('/logout', authenticateToken, logout);

// GET /api/v1/auth/me
router.get('/me', authenticateToken, me);

export default router;
