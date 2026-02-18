import express from 'express';
import { getEmpresas, getActividadesEconomicas } from '../controllers/empresaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getEmpresas);
router.get('/:id/actividades-economicas', auth, getActividadesEconomicas);

export default router;
