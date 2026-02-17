// LENDERO HUACHI - Auth Controller
// Controlador para login, registro, etc.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';
import logger from '../utils/logger.js';

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email y contraseña son requeridos',
        },
      });
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        usuario_roles: {
          include: {
            rol: true,
            empresa: true,
          },
        },
      },
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña incorrectos',
        },
      });
    }

    // Verificar si está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INACTIVE_USER',
          message: 'Usuario inactivo',
        },
      });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña incorrectos',
        },
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`Usuario ${email} inició sesión`);

    // Respuesta
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre_completo: usuario.nombre_completo,
          roles: usuario.usuario_roles.map(ur => ({
            id: ur.rol.id,
            nombre: ur.rol.nombre,
            empresa_id: ur.empresa_id,
            empresa: ur.empresa ? {
              id: ur.empresa.id,
              rfc: ur.empresa.rfc,
              razon_social: ur.empresa.razon_social,
            } : null,
          })),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario actual
export const me = async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: {
        usuario_roles: {
          include: {
            rol: true,
            empresa: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        id: usuario.id,
        email: usuario.email,
        nombre_completo: usuario.nombre_completo,
        telefono: usuario.telefono,
        roles: usuario.usuario_roles.map(ur => ({
          id: ur.rol.id,
          nombre: ur.rol.nombre,
          empresa_id: ur.empresa_id,
          empresa: ur.empresa,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout (opcional, principalmente para invalidar token en cliente)
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
};
