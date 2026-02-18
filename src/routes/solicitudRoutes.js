import express from 'express';
import {
  crearSolicitud,
  getSolicitudes,
  getSolicitudById,
  cambiarEstatus,
} from '../controllers/solicitudController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, crearSolicitud);
router.get('/', authenticateToken, getSolicitudes);
router.get('/:id', authenticateToken, getSolicitudById);
router.patch('/:id/estatus', authenticateToken, cambiarEstatus);

export default router;
