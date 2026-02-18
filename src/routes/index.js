// LENDERO HUACHI - Routes Index
// Combina todas las rutas de la aplicación

import express from 'express';
import authRoutes from './auth.routes.js';
import solicitudesRoutes from './solicitudes.routes.js';
import empresasRoutes from './empresas.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import empresaRoutes from './empresaRoutes.js';
import catalogoRoutes from './catalogoRoutes.js';
import solicitudRoutes from './solicitudRoutes.js';

const router = express.Router();

// Health check de API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LENDERO HUACHI API v1',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Rutas originales (mantenemos por compatibilidad)
router.use('/auth', authRoutes);
router.use('/solicitudes-old', solicitudesRoutes);
router.use('/empresas-old', empresasRoutes);
router.use('/dashboard', dashboardRoutes);

// Rutas nuevas del módulo de solicitud
router.use('/empresas', empresaRoutes);
router.use('/catalogos', catalogoRoutes);
router.use('/solicitudes', solicitudRoutes);

export default router;
