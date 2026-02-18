import { prisma } from '../server.js';

// Obtener catálogo de Uso CFDI
export const getUsosCfdi = async (req, res) => {
  try {
    const usos = await prisma.catalogoUsoCfdi.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    res.json({
      success: true,
      data: usos,
    });
  } catch (error) {
    console.error('Error obteniendo usos CFDI:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener catálogo de uso CFDI',
      },
    });
  }
};

// Obtener catálogo de Forma de Pago
export const getFormasPago = async (req, res) => {
  try {
    const formas = await prisma.catalogoFormaPago.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    res.json({
      success: true,
      data: formas,
    });
  } catch (error) {
    console.error('Error obteniendo formas de pago:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener catálogo de forma de pago',
      },
    });
  }
};

// Obtener catálogo de Método de Pago
export const getMetodosPago = async (req, res) => {
  try {
    const metodos = await prisma.catalogoMetodoPago.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    res.json({
      success: true,
      data: metodos,
    });
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener catálogo de método de pago',
      },
    });
  }
};

// Obtener catálogo de Unidad de Medida
export const getUnidadesMedida = async (req, res) => {
  try {
    const unidades = await prisma.catalogoUnidadMedida.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });

    res.json({
      success: true,
      data: unidades,
    });
  } catch (error) {
    console.error('Error obteniendo unidades de medida:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener catálogo de unidad de medida',
      },
    });
  }
};
