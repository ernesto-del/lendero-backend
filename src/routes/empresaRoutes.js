import express from 'express';
import { getEmpresas, getActividadesEconomicas } from '../controllers/empresaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getEmpresas);
router.get('/:id/actividades-economicas', authenticateToken, getActividadesEconomicas);

export default router;
