// LENDERO HUACHI - Solicitudes Controller
// Controlador para gestión de solicitudes

import { prisma } from '../server.js';
import logger from '../utils/logger.js';

// Listar solicitudes
export const getSolicitudes = async (req, res, next) => {
  try {
    const { 
      estatus, 
      page = 1, 
      limit = 20,
      empresa_despacho_id,
      empresa_cliente_id,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Filtros
    const where = {};
    
    if (estatus) {
      where.estatus = estatus;
    }

    // Filtrar según rol del usuario
    const userRoles = req.user.roles.map(r => r.nombre);
    const empresasIds = req.user.roles.map(r => r.empresa_id).filter(Boolean);

    if (userRoles.includes('CORPORATIVO')) {
      where.empresa_despacho_id = { in: empresasIds };
    } else if (userRoles.includes('ADMINISTRADOR')) {
      where.empresa_cliente_id = { in: empresasIds };
    }

    if (empresa_despacho_id) {
      where.empresa_despacho_id = parseInt(empresa_despacho_id);
    }

    if (empresa_cliente_id) {
      where.empresa_cliente_id = parseInt(empresa_cliente_id);
    }

    // Obtener solicitudes
    const [solicitudes, total] = await Promise.all([
      prisma.solicitud.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          empresa_despacho: true,
          empresa_cliente: true,
          producto_fiscal: true,
          concepto: true,
        },
        orderBy: {
          fecha_solicitud: 'desc',
        },
      }),
      prisma.solicitud.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        solicitudes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener solicitud por ID
export const getSolicitudById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) },
      include: {
        empresa_despacho: true,
        empresa_cliente: true,
        producto_fiscal: true,
        concepto: true,
        detalles: true,
        prefacturas: true,
        comprobantes: true,
        dispersiones: {
          include: {
            detalles: true,
          },
        },
        documentos: true,
      },
    });

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Solicitud no encontrada',
        },
      });
    }

    res.json({
      success: true,
      data: solicitud,
    });
  } catch (error) {
    next(error);
  }
};

// Crear solicitud
export const createSolicitud = async (req, res, next) => {
  try {
    const {
      empresa_despacho_id,
      empresa_cliente_id,
      producto_fiscal_id,
      concepto_id,
      monto_total,
      detalles,
      notas,
    } = req.body;

    // Generar folio único
    const year = new Date().getFullYear();
    const lastSolicitud = await prisma.solicitud.findFirst({
      where: {
        folio: {
          startsWith: `SOL-${year}-`,
        },
      },
      orderBy: {
        folio: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastSolicitud) {
      const lastNumber = parseInt(lastSolicitud.folio.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const folio = `SOL-${year}-${nextNumber.toString().padStart(5, '0')}`;

    // Crear solicitud con detalles
    const solicitud = await prisma.solicitud.create({
      data: {
        folio,
        empresa_despacho_id: parseInt(empresa_despacho_id),
        empresa_cliente_id: parseInt(empresa_cliente_id),
        producto_fiscal_id: parseInt(producto_fiscal_id),
        concepto_id: parseInt(concepto_id),
        monto_total: parseFloat(monto_total),
        estatus: 'PENDIENTE_AUTORIZACION',
        usuario_solicita_id: req.user.id,
        notas,
        detalles: {
          create: detalles.map(d => ({
            concepto_descripcion: d.concepto_descripcion,
            cantidad: parseInt(d.cantidad),
            precio_unitario: parseFloat(d.precio_unitario),
            subtotal: parseFloat(d.subtotal),
            iva: parseFloat(d.iva),
            total: parseFloat(d.total),
          })),
        },
      },
      include: {
        empresa_despacho: true,
        empresa_cliente: true,
        detalles: true,
      },
    });

    logger.info(`Solicitud ${folio} creada por usuario ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: solicitud,
      message: 'Solicitud creada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar estatus de solicitud
export const updateSolicitudEstatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nuevo_estatus, comentarios } = req.body;

    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: {
        estatus: nuevo_estatus,
      },
    });

    logger.info(`Solicitud ${id} cambió a estatus ${nuevo_estatus}`);

    res.json({
      success: true,
      data: solicitud,
      message: 'Estatus actualizado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
