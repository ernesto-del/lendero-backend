import express from 'express';
import {
  crearSolicitud,
  getSolicitudes,
  getSolicitudById,
  cambiarEstatus,
} from '../controllers/solicitudController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, crearSolicitud);
router.get('/', auth, getSolicitudes);
router.get('/:id', auth, getSolicitudById);
router.patch('/:id/estatus', auth, cambiarEstatus);

export default router;
