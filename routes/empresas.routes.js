// LENDERO HUACHI - Empresas Routes

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../server.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/v1/empresas
router.get('/', async (req, res, next) => {
  try {
    const empresasIds = req.user.roles.map(r => r.empresa_id).filter(Boolean);
    
    const empresas = await prisma.empresa.findMany({
      where: {
        id: { in: empresasIds },
      },
      include: {
        cuentas_bancarias: true,
      },
    });

    res.json({
      success: true,
      data: empresas,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
