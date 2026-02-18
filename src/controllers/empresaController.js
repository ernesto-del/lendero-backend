import { prisma } from '../server.js';

// Obtener todas las empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany({
      where: { activo: true },
      select: {
        id: true,
        rfc: true,
        razon_social: true,
        tipo: true,
        direccion: true,
        codigo_postal: true,
      },
      orderBy: { razon_social: 'asc' },
    });

    res.json({
      success: true,
      data: empresas,
    });
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener empresas',
      },
    });
  }
};

// Obtener actividades económicas de una empresa
export const getActividadesEconomicas = async (req, res) => {
  try {
    const { id } = req.params;

    const actividades = await prisma.actividadEconomica.findMany({
      where: {
        empresa_id: parseInt(id),
        activo: true,
      },
      select: {
        id: true,
        clave: true,
        descripcion: true,
      },
      orderBy: { descripcion: 'asc' },
    });

    res.json({
      success: true,
      data: actividades,
    });
  } catch (error) {
    console.error('Error obteniendo actividades económicas:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener actividades económicas',
      },
    });
  }
};
