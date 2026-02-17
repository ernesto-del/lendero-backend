// LENDERO HUACHI - Solicitudes Routes

import express from 'express';
import {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitudEstatus,
} from '../controllers/solicitudes.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/v1/solicitudes
router.get('/', getSolicitudes);

// GET /api/v1/solicitudes/:id
router.get('/:id', getSolicitudById);

// POST /api/v1/solicitudes (solo ADMINISTRADOR)
router.post('/', requireRole('ADMINISTRADOR'), createSolicitud);

// PATCH /api/v1/solicitudes/:id/estatus
router.patch('/:id/estatus', updateSolicitudEstatus);

export default router;
