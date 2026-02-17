import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuarios...');

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Crear usuarios
  const maria = await prisma.usuario.upsert({
    where: { email: 'maria@fiscalcorp.com' },
    update: {},
    create: {
      email: 'maria@fiscalcorp.com',
      password_hash: hashedPassword,
      nombre_completo: 'María García',
      telefono: '5551234567',
      activo: true,
    },
  });

  const juan = await prisma.usuario.upsert({
    where: { email: 'juan@miempresa.com' },
    update: {},
    create: {
      email: 'juan@miempresa.com',
      password_hash: hashedPassword,
      nombre_completo: 'Juan Pérez',
      telefono: '5559876543',
      activo: true,
    },
  });

  console.log('✅ Usuarios creados');
  console.log('maria@fiscalcorp.com / password123');
  console.log('juan@miempresa.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
