# LENDERO HUACHI - Backend API

API REST para plataforma de gestión de estrategias fiscales en México.

## 🚀 Quick Start

### Prerequisitos

- Node.js 20+ 
- PostgreSQL 15+
- npm o yarn

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Generar cliente de Prisma
npm run prisma:generate

# 4. Ejecutar migraciones
npm run prisma:migrate

# 5. Cargar datos de prueba
npm run prisma:seed

# 6. Iniciar servidor
npm run dev
```

Servidor corriendo en: `http://localhost:3000`

## 📦 Scripts Disponibles

- `npm run dev` - Modo desarrollo con auto-reload
- `npm start` - Modo producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:seed` - Cargar datos iniciales
- `npm run prisma:studio` - Abrir Prisma Studio (GUI para BD)

## 🔑 Usuarios de Prueba

Después del seed, puedes usar estos usuarios:

**Corporativo (Despacho):**
- Email: `maria@fiscalcorp.com`
- Password: `password123`

**Administrador (Cliente):**
- Email: `juan@miempresa.com`  
- Password: `password123`

**Consulta:**
- Email: `consulta@empresa.com`
- Password: `password123`

## 📡 API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual
- `POST /api/v1/auth/logout` - Cerrar sesión

### Solicitudes
- `GET /api/v1/solicitudes` - Listar solicitudes
- `GET /api/v1/solicitudes/:id` - Obtener solicitud
- `POST /api/v1/solicitudes` - Crear solicitud
- `PATCH /api/v1/solicitudes/:id/estatus` - Actualizar estatus

### Empresas
- `GET /api/v1/empresas` - Listar empresas del usuario

### Dashboard
- `GET /api/v1/dashboard/stats` - Estadísticas

## 🗄️ Base de Datos

PostgreSQL con Prisma ORM

**Modelo principal:**
- Usuarios y Roles
- Empresas y Cuentas Bancarias
- Productos Fiscales y Conceptos
- Solicitudes (core)
- Pre-facturas
- Comprobantes de Pago
- Dispersiones
- Documentos Generados
- Audit Log

Ver `prisma/schema.prisma` para modelo completo.

## 🔐 Autenticación

JWT (JSON Web Tokens)

Header requerido en rutas protegidas:
```
Authorization: Bearer {token}
```

## 📁 Estructura del Proyecto

```
src/
├── config/         # Configuraciones
├── middleware/     # Middleware (auth, errors)
├── routes/         # Definición de rutas
├── controllers/    # Lógica de negocio
├── services/       # Servicios (email, IA, etc)
├── validators/     # Validación de datos
├── utils/          # Utilidades
└── server.js       # Entry point
```

## 🛠️ Tecnologías

- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **Winston** - Logging

## 📝 Variables de Entorno

Ver `.env.example` para todas las variables requeridas.

**Mínimas para desarrollo:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lendero_huachi"
JWT_SECRET="tu-secreto-seguro"
PORT=3000
NODE_ENV=development
```

## 🚢 Deployment

### Railway

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Crear proyecto
railway init

# 4. Agregar PostgreSQL
railway add

# 5. Deploy
railway up
```

### Render

1. Conectar repositorio de GitHub
2. Agregar PostgreSQL database
3. Configurar variables de entorno
4. Deploy automático

## 📊 Monitoring

- Logs: Winston (archivos en `/logs`)
- Errors: Capturados en `error.log`
- Health check: `GET /health`

## 🐛 Debugging

```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Prisma Studio (GUI para BD)
npm run prisma:studio
```

## 📄 Licencia

Propietario - LENDERO HUACHI © 2025
