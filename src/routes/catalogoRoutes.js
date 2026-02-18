import express from 'express';
import {
  getUsosCfdi,
  getFormasPago,
  getMetodosPago,
  getUnidadesMedida,
} from '../controllers/catalogoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/uso-cfdi', authenticateToken, getUsosCfdi);
router.get('/forma-pago', authenticateToken, getFormasPago);
router.get('/metodo-pago', authenticateToken, getMetodosPago);
router.get('/unidad-medida', authenticateToken, getUnidadesMedida);

export default router;
