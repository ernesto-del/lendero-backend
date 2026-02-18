import { prisma } from '../server.js';

// Generar folio único
const generarFolio = async () => {
  const año = new Date().getFullYear();
  const ultimaSolicitud = await prisma.solicitud.findFirst({
    where: {
      folio: {
        startsWith: `SOL-${año}-`,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  let numero = 1;
  if (ultimaSolicitud) {
    const ultimoNumero = parseInt(ultimaSolicitud.folio.split('-')[2]);
    numero = ultimoNumero + 1;
  }

  return `SOL-${año}-${numero.toString().padStart(4, '0')}`;
};

// Crear nueva solicitud
export const crearSolicitud = async (req, res) => {
  try {
    const {
      empresa_emisor_id,
      actividad_economica_id,
      cliente_razon_social,
      cliente_rfc,
      cliente_direccion,
      cliente_codigo_postal,
      metodo_pago_id,
      forma_pago_id,
      uso_cfdi_id,
      conceptos,
      subtotal,
      iva,
      monto_total,
      notas,
    } = req.body;

    // Validaciones
    if (!empresa_emisor_id || !actividad_economica_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Empresa emisora y actividad económica son requeridos',
        },
      });
    }

    if (!conceptos || conceptos.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Debe incluir al menos un concepto',
        },
      });
    }

    // Generar folio
    const folio = await generarFolio();

    // Obtener usuario del token
    const usuario_id = req.user.userId;

    // Crear solicitud con conceptos
    const solicitud = await prisma.solicitud.create({
      data: {
        folio,
        empresa_emisor_id: parseInt(empresa_emisor_id),
        actividad_economica_id: parseInt(actividad_economica_id),
        cliente_razon_social,
        cliente_rfc,
        cliente_direccion,
        cliente_codigo_postal,
        metodo_pago_id,
        forma_pago_id,
        uso_cfdi_id,
        subtotal: parseFloat(subtotal),
        iva: parseFloat(iva),
        monto_total: parseFloat(monto_total),
        estatus: 'PENDIENTE_AUTORIZACION',
        usuario_solicita_id: usuario_id,
        notas,
        conceptos: {
          create: conceptos.map((c) => ({
            cantidad: parseFloat(c.cantidad),
            unidad_medida_id: c.unidad_medida_id,
            clave_producto: c.clave_producto,
            descripcion: c.descripcion,
            precio_unitario: parseFloat(c.precio_unitario),
            subtotal: parseFloat(c.subtotal),
            iva: parseFloat(c.iva),
            importe: parseFloat(c.importe),
          })),
        },
        cambios_estatus: {
          create: {
            estatus_nuevo: 'PENDIENTE_AUTORIZACION',
            usuario_cambio_id: usuario_id,
            comentario: 'Solicitud creada',
          },
        },
      },
      include: {
        empresa_emisor: true,
        actividad_economica: true,
        conceptos: true,
      },
    });

    res.status(201).json({
      success: true,
      data: solicitud,
    });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al crear solicitud',
        details: error.message,
      },
    });
  }
};

// Obtener todas las solicitudes
export const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      include: {
        empresa_emisor: {
          select: {
            razon_social: true,
            rfc: true,
          },
        },
        usuario_solicita: {
          select: {
            nombre_completo: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_solicitud: 'desc',
      },
    });

    res.json({
      success: true,
      data: solicitudes,
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener solicitudes',
      },
    });
  }
};

// Obtener una solicitud por ID
export const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) },
      include: {
        empresa_emisor: true,
        actividad_economica: true,
        metodo_pago: true,
        forma_pago: true,
        uso_cfdi: true,
        conceptos: {
          include: {
            unidad_medida: true,
          },
        },
        cambios_estatus: {
          orderBy: {
            fecha_cambio: 'desc',
          },
        },
        usuario_solicita: {
          select: {
            nombre_completo: true,
            email: true,
          },
        },
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
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener solicitud',
      },
    });
  }
};

// Cambiar estatus de solicitud
export const cambiarEstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus, comentario } = req.body;
    const usuario_id = req.user.userId;

    const solicitudActual = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) },
    });

    if (!solicitudActual) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Solicitud no encontrada',
        },
      });
    }

    const solicitudActualizada = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: {
        estatus,
        cambios_estatus: {
          create: {
            estatus_anterior: solicitudActual.estatus,
            estatus_nuevo: estatus,
            usuario_cambio_id: usuario_id,
            comentario,
          },
        },
      },
      include: {
        empresa_emisor: true,
        cambios_estatus: {
          orderBy: {
            fecha_cambio: 'desc',
          },
          take: 1,
        },
      },
    });

    res.json({
      success: true,
      data: solicitudActualizada,
    });
  } catch (error) {
    console.error('Error cambiando estatus:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al cambiar estatus',
      },
    });
  }
};
