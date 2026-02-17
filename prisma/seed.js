// LENDERO HUACHI - Seed Data
// Datos iniciales para desarrollo y testing

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes (solo en desarrollo)
  await prisma.notificacion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.documentoGenerado.deleteMany();
  await prisma.dispersionDetalle.deleteMany();
  await prisma.dispersion.deleteMany();
  await prisma.comprobantePago.deleteMany();
  await prisma.datosPago.deleteMany();
  await prisma.prefactura.deleteMany();
  await prisma.solicitudDetalle.deleteMany();
  await prisma.solicitud.deleteMany();
  await prisma.concepto.deleteMany();
  await prisma.productoFiscal.deleteMany();
  await prisma.cuentaBancaria.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.usuario.deleteMany();

  // ==================== ROLES ====================
  console.log('Creando roles...');
  const rolCorporativo = await prisma.rol.create({
    data: {
      nombre: 'CORPORATIVO',
      descripcion: 'Despacho fiscal que presta la estrategia',
    },
  });

  const rolAdministrador = await prisma.rol.create({
    data: {
      nombre: 'ADMINISTRADOR',
      descripcion: 'Cliente que solicita la estrategia',
    },
  });

  const rolConsulta = await prisma.rol.create({
    data: {
      nombre: 'CONSULTA',
      descripcion: 'Usuario de solo lectura',
    },
  });

  // ==================== USUARIOS ====================
  console.log('Creando usuarios...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // Usuario Corporativo (Despacho)
  const usuarioCorporativo = await prisma.usuario.create({
    data: {
      email: 'maria@fiscalcorp.com',
      password_hash: passwordHash,
      nombre_completo: 'María González',
      telefono: '5551234567',
    },
  });

  // Usuario Administrador (Cliente)
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      email: 'juan@miempresa.com',
      password_hash: passwordHash,
      nombre_completo: 'Juan Pérez',
      telefono: '5559876543',
    },
  });

  // Usuario Consulta
  const usuarioConsulta = await prisma.usuario.create({
    data: {
      email: 'consulta@empresa.com',
      password_hash: passwordHash,
      nombre_completo: 'Ana Martínez',
      telefono: '5555555555',
    },
  });

  // ==================== EMPRESAS ====================
  console.log('Creando empresas...');
  
  // Empresa Despacho
  const empresaDespacho = await prisma.empresa.create({
    data: {
      rfc: 'FIS123456ABC',
      razon_social: 'FISCAL CORPORATIVO SA DE CV',
      actividad_economica: 'Servicios de consultoría fiscal',
      tipo: 'DESPACHO',
      usuario_propietario_id: usuarioCorporativo.id,
    },
  });

  // Empresa Cliente 1
  const empresaCliente1 = await prisma.empresa.create({
    data: {
      rfc: 'ABC123456XYZ',
      razon_social: 'MI EMPRESA SA DE CV',
      actividad_economica: 'Servicios de Tecnología',
      tipo: 'CLIENTE',
      usuario_propietario_id: usuarioAdmin.id,
    },
  });

  // Empresa Cliente 2
  const empresaCliente2 = await prisma.empresa.create({
    data: {
      rfc: 'XYZ987654ABC',
      razon_social: 'COMERCIALIZADORA ABC SA DE CV',
      actividad_economica: 'Comercio al por mayor',
      tipo: 'CLIENTE',
      usuario_propietario_id: usuarioAdmin.id,
    },
  });

  // ==================== USUARIO ROLES ====================
  console.log('Asignando roles a usuarios...');
  
  await prisma.usuarioRol.create({
    data: {
      usuario_id: usuarioCorporativo.id,
      rol_id: rolCorporativo.id,
      empresa_id: empresaDespacho.id,
    },
  });

  await prisma.usuarioRol.create({
    data: {
      usuario_id: usuarioAdmin.id,
      rol_id: rolAdministrador.id,
      empresa_id: empresaCliente1.id,
    },
  });

  await prisma.usuarioRol.create({
    data: {
      usuario_id: usuarioConsulta.id,
      rol_id: rolConsulta.id,
      empresa_id: empresaCliente1.id,
    },
  });

  // ==================== CUENTAS BANCARIAS ====================
  console.log('Creando cuentas bancarias...');
  
  await prisma.cuentaBancaria.create({
    data: {
      empresa_id: empresaDespacho.id,
      banco: 'BBVA Bancomer',
      clabe: '012180001234567890',
      alias: 'Cuenta principal',
    },
  });

  await prisma.cuentaBancaria.create({
    data: {
      empresa_id: empresaCliente1.id,
      banco: 'Santander',
      clabe: '014180009876543210',
      alias: 'Cuenta operativa',
    },
  });

  // ==================== PRODUCTOS FISCALES ====================
  console.log('Creando productos fiscales...');
  
  const productoServProf = await prisma.productoFiscal.create({
    data: {
      empresa_despacho_id: empresaDespacho.id,
      tipo: 'SERVICIOS_PROFESIONALES',
      descripcion: 'Servicios profesionales independientes',
    },
  });

  const productoAsimilado = await prisma.productoFiscal.create({
    data: {
      empresa_despacho_id: empresaDespacho.id,
      tipo: 'ASIMILADO',
      descripcion: 'Asimilados a salarios',
    },
  });

  const productoHonorario = await prisma.productoFiscal.create({
    data: {
      empresa_despacho_id: empresaDespacho.id,
      tipo: 'HONORARIO',
      descripcion: 'Honorarios profesionales',
    },
  });

  // ==================== CONCEPTOS ====================
  console.log('Creando conceptos...');
  
  const conceptoDesarrollo = await prisma.concepto.create({
    data: {
      empresa_id: empresaDespacho.id,
      producto_fiscal_id: productoServProf.id,
      descripcion: 'Desarrollo de software',
      unidad_medida: 'Servicio',
    },
  });

  await prisma.concepto.create({
    data: {
      empresa_id: empresaDespacho.id,
      producto_fiscal_id: productoServProf.id,
      descripcion: 'Consultoría tecnológica',
      unidad_medida: 'Hora',
    },
  });

  await prisma.concepto.create({
    data: {
      empresa_id: empresaDespacho.id,
      producto_fiscal_id: productoAsimilado.id,
      descripcion: 'Nómina ejecutiva',
      unidad_medida: 'Servicio',
    },
  });

  // ==================== SOLICITUD DE EJEMPLO ====================
  console.log('Creando solicitud de ejemplo...');
  
  const solicitud = await prisma.solicitud.create({
    data: {
      folio: 'SOL-2025-00001',
      empresa_despacho_id: empresaDespacho.id,
      empresa_cliente_id: empresaCliente1.id,
      producto_fiscal_id: productoServProf.id,
      concepto_id: conceptoDesarrollo.id,
      monto_total: 125000.00,
      estatus: 'PENDIENTE_AUTORIZACION',
      usuario_solicita_id: usuarioAdmin.id,
      notas: 'Proyecto Q1 2025 - Desarrollo de módulo de facturación',
    },
  });

  // Detalle de solicitud
  await prisma.solicitudDetalle.create({
    data: {
      solicitud_id: solicitud.id,
      concepto_descripcion: 'Desarrollo de módulo de facturación completo',
      cantidad: 1,
      precio_unitario: 125000.00,
      subtotal: 107758.62,
      iva: 17241.38,
      total: 125000.00,
    },
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📧 Usuarios creados:');
  console.log('   Corporativo: maria@fiscalcorp.com / password123');
  console.log('   Administrador: juan@miempresa.com / password123');
  console.log('   Consulta: consulta@empresa.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
