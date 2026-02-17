// LENDERO HUACHI - Dashboard Routes

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../server.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/v1/dashboard/stats
router.get('/stats', async (req, res, next) => {
  try {
    const userRoles = req.user.roles.map(r => r.nombre);
    const empresasIds = req.user.roles.map(r => r.empresa_id).filter(Boolean);

    let whereClause = {};
    
    if (userRoles.includes('CORPORATIVO')) {
      whereClause.empresa_despacho_id = { in: empresasIds };
    } else if (userRoles.includes('ADMINISTRADOR')) {
      whereClause.empresa_cliente_id = { in: empresasIds };
    }

    // Obtener estadísticas
    const [
      solicitudes_activas,
      solicitudes_pendientes,
      monto_total,
    ] = await Promise.all([
      prisma.solicitud.count({
        where: {
          ...whereClause,
          estatus: { notIn: ['DISPERSADA', 'CANCELADA'] },
        },
      }),
      prisma.solicitud.count({
        where: {
          ...whereClause,
          estatus: 'PENDIENTE_AUTORIZACION',
        },
      }),
      prisma.solicitud.aggregate({
        where: whereClause,
        _sum: {
          monto_total: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        solicitudes_activas,
        solicitudes_pendientes,
        monto_total_facturado: monto_total._sum.monto_total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
