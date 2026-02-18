import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.solicitudConcepto.deleteMany();
  await prisma.solicitudCambioEstatus.deleteMany();
  await prisma.solicitud.deleteMany();
  await prisma.actividadEconomica.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.catalogoUsoCfdi.deleteMany();
  await prisma.catalogoFormaPago.deleteMany();
  await prisma.catalogoMetodoPago.deleteMany();
  await prisma.catalogoUnidadMedida.deleteMany();

  console.log('✅ Datos existentes eliminados');

  // ==================== CATÁLOGOS DEL SAT ====================
  
  console.log('📋 Creando catálogos del SAT...');

  // Uso de CFDI
  const usosCfdi = [
    { id: 'G01', descripcion: 'Adquisición de mercancías', persona_fisica: true, persona_moral: true },
    { id: 'G03', descripcion: 'Gastos en general', persona_fisica: true, persona_moral: true },
    { id: 'D01', descripcion: 'Honorarios médicos, dentales y gastos hospitalarios', persona_fisica: true, persona_moral: false },
    { id: 'D02', descripcion: 'Gastos médicos por incapacidad o discapacidad', persona_fisica: true, persona_moral: false },
    { id: 'D03', descripcion: 'Gastos funerales', persona_fisica: true, persona_moral: false },
    { id: 'D04', descripcion: 'Donativos', persona_fisica: true, persona_moral: false },
    { id: 'P01', descripcion: 'Por definir', persona_fisica: true, persona_moral: true },
  ];

  for (const uso of usosCfdi) {
    await prisma.catalogoUsoCfdi.create({ data: uso });
  }

  // Forma de Pago
  const formasPago = [
    { id: '01', descripcion: 'Efectivo' },
    { id: '02', descripcion: 'Cheque nominativo' },
    { id: '03', descripcion: 'Transferencia electrónica de fondos' },
    { id: '04', descripcion: 'Tarjeta de crédito' },
    { id: '28', descripcion: 'Tarjeta de débito' },
    { id: '99', descripcion: 'Por definir' },
  ];

  for (const forma of formasPago) {
    await prisma.catalogoFormaPago.create({ data: forma });
  }

  // Método de Pago
  const metodosPago = [
    { id: 'PUE', descripcion: 'Pago en una sola exhibición' },
    { id: 'PPD', descripcion: 'Pago en parcialidades o diferido' },
  ];

  for (const metodo of metodosPago) {
    await prisma.catalogoMetodoPago.create({ data: metodo });
  }

  // Unidades de Medida
  const unidadesMedida = [
    { id: 'H87', descripcion: 'Pieza' },
    { id: 'E48', descripcion: 'Unidad de servicio' },
    { id: 'ACT', descripcion: 'Actividad' },
    { id: 'KGM', descripcion: 'Kilogramo' },
    { id: 'XBX', descripcion: 'Caja' },
    { id: 'MTR', descripcion: 'Metro' },
    { id: 'LTR', descripcion: 'Litro' },
  ];

  for (const unidad of unidadesMedida) {
    await prisma.catalogoUnidadMedida.create({ data: unidad });
  }

  console.log('✅ Catálogos del SAT creados');

  // ==================== ROLES ====================
  
  console.log('👥 Creando roles...');

  const rolAdministrador = await prisma.rol.create({
    data: {
      nombre: 'ADMINISTRADOR',
      descripcion: 'Usuario cliente que crea solicitudes de factura',
    },
  });

  const rolCorporativo = await prisma.rol.create({
    data: {
      nombre: 'CORPORATIVO',
      descripcion: 'Usuario del despacho que gestiona solicitudes',
    },
  });

  console.log('✅ Roles creados');

  // ==================== EMPRESAS ====================
  
  console.log('🏢 Creando empresas...');

  const empresaCliente1 = await prisma.empresa.create({
    data: {
      rfc: 'MEX850101ABC',
      razon_social: 'MI EMPRESA EJEMPLO SA DE CV',
      tipo: 'CLIENTE',
      direccion: 'Av. Reforma 123, Col. Centro',
      codigo_postal: '06000',
      activo: true,
    },
  });

  const empresaCliente2 = await prisma.empresa.create({
    data: {
      rfc: 'COM950101XYZ',
      razon_social: 'COMERCIALIZADORA DEMO SA DE CV',
      tipo: 'CLIENTE',
      direccion: 'Calle Insurgentes 456, Col. Roma',
      codigo_postal: '06700',
      activo: true,
    },
  });

  console.log('✅ Empresas creadas');

  // ==================== ACTIVIDADES ECONÓMICAS ====================
  
  console.log('💼 Creando actividades económicas...');

  await prisma.actividadEconomica.createMany({
    data: [
      {
        empresa_id: empresaCliente1.id,
        clave: '621111',
        descripcion: 'Consultoría en computación y servicios relacionados',
        activo: true,
      },
      {
        empresa_id: empresaCliente1.id,
        clave: '541211',
        descripcion: 'Despachos de contadores',
        activo: true,
      },
      {
        empresa_id: empresaCliente2.id,
        clave: '466410',
        descripcion: 'Comercio al por mayor de materias primas',
        activo: true,
      },
      {
        empresa_id: empresaCliente2.id,
        clave: '468211',
        descripcion: 'Comercio al por mayor de productos farmacéuticos',
        activo: true,
      },
    ],
  });

  console.log('✅ Actividades económicas creadas');

  // ==================== USUARIOS ====================
  
  console.log('👤 Creando usuarios...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const usuarioAdmin1 = await prisma.usuario.create({
    data: {
      email: 'juan@miempresa.com',
      password_hash: hashedPassword,
      nombre_completo: 'Juan Pérez',
      telefono: '5559876543',
      activo: true,
    },
  });

  const usuarioCorporativo = await prisma.usuario.create({
    data: {
      email: 'maria@fiscalcorp.com',
      password_hash: hashedPassword,
      nombre_completo: 'María García',
      telefono: '5551234567',
      activo: true,
    },
  });

  console.log('✅ Usuarios creados');

  // ==================== ASIGNAR ROLES ====================
  
  console.log('🔐 Asignando roles...');

  await prisma.usuarioRol.create({
    data: {
      usuario_id: usuarioAdmin1.id,
      rol_id: rolAdministrador.id,
      empresa_id: empresaCliente1.id,
    },
  });

  await prisma.usuarioRol.create({
    data: {
      usuario_id: usuarioCorporativo.id,
      rol_id: rolCorporativo.id,
      empresa_id: null,
    },
  });

  console.log('✅ Roles asignados');

  // ==================== RESUMEN ====================
  
  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📊 RESUMEN:');
  console.log('  • Catálogos SAT: Creados');
  console.log('  • Roles: 2');
  console.log('  • Empresas: 2');
  console.log('  • Actividades Económicas: 4');
  console.log('  • Usuarios: 2\n');
  console.log('👤 USUARIOS DE PRUEBA:');
  console.log('  📧 juan@miempresa.com / password123 (ADMINISTRADOR)');
  console.log('  📧 maria@fiscalcorp.com / password123 (CORPORATIVO)\n');
  console.log('🏢 EMPRESAS:');
  console.log('  • MI EMPRESA EJEMPLO SA DE CV (RFC: MEX850101ABC)');
  console.log('  • COMERCIALIZADORA DEMO SA DE CV (RFC: COM950101XYZ)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
