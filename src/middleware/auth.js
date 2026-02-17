// LENDERO HUACHI - Middleware de Autenticación
// Verificación de JWT tokens

import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';
import logger from '../utils/logger.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Token de autenticación requerido',
        },
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario de la BD
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        usuario_roles: {
          include: {
            rol: true,
            empresa: true,
          },
        },
      },
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido o usuario inactivo',
        },
      });
    }

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimo_acceso: new Date() },
    });

    // Agregar usuario al request
    req.user = {
      id: usuario.id,
      email: usuario.email,
      nombre_completo: usuario.nombre_completo,
      roles: usuario.usuario_roles.map(ur => ({
        id: ur.rol.id,
        nombre: ur.rol.nombre,
        empresa_id: ur.empresa_id,
        empresa: ur.empresa,
      })),
    };

    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido',
        },
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token expirado',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Error en autenticación',
      },
    });
  }
};

// Middleware para verificar rol específico
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRoles = req.user.roles.map(r => r.nombre);
    const tieneRol = rolesPermitidos.some(rol => userRoles.includes(rol));

    if (!tieneRol) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'No tienes permisos para esta acción',
          required_roles: rolesPermitidos,
        },
      });
    }

    next();
  };
};
