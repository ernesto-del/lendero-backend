import express from 'express';
import {
  getUsosCfdi,
  getFormasPago,
  getMetodosPago,
  getUnidadesMedida,
} from '../controllers/catalogoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/uso-cfdi', auth, getUsosCfdi);
router.get('/forma-pago', auth, getFormasPago);
router.get('/metodo-pago', auth, getMetodosPago);
router.get('/unidad-medida', auth, getUnidadesMedida);

export default router;
