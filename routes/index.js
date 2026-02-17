// LENDERO HUACHI - Routes Index
// Combina todas las rutas de la aplicación

import express from 'express';
import authRoutes from './auth.routes.js';
import solicitudesRoutes from './solicitudes.routes.js';
import empresasRoutes from './empresas.routes.js';
import dashboardRoutes from './dashboard.routes.js';

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

// Rutas
router.use('/auth', authRoutes);
router.use('/solicitudes', solicitudesRoutes);
router.use('/empresas', empresasRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
