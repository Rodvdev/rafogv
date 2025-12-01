# Talleres Lima - Sistema de Gestión

Sistema de gestión de talleres mecánicos y rectificadoras en Lima con autenticación y CRUD completo.

## 🚀 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/talleres_lima?schema=public"

# NextAuth Secret (genera uno con: openssl rand -base64 32)
AUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

### Generar AUTH_SECRET

```bash
openssl rand -base64 32
```

## 📦 Instalación

```bash
npm install
```

## 🗄️ Base de Datos

### Migraciones

```bash
npm run prisma:migrate:dev --name init
```

### Seed de Datos

```bash
# Seed de talleres y rectificadoras
npm run prisma:seed

# Seed de usuarios (super admin)
npm run prisma:seed-users
```

### Credenciales por Defecto

- **Email:** `oficina@rgvautoparts.com`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`

## 🛠️ Desarrollo

```bash
npm run dev
```

## 📊 Dashboard

Accede al dashboard en `/dashboard` después de iniciar sesión.

### Características

- ✅ Paginación (10 registros por página)
- ✅ Búsqueda por nombre
- ✅ Filtros por estado (verificado/no verificado)
- ✅ Filtro por distrito
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Marcar registros como verificados
- ✅ Tablas separadas para Talleres y Rectificadoras

## 🚢 Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno:
   - `DATABASE_URL`
   - `AUTH_SECRET` (genera uno nuevo para producción)
3. Deploy automático

## 📝 Fuentes Principales

- [TallerMec.net.pe](https://tallermec.net.pe)
- [Páginas Amarillas](https://www.paginasamarillas.com.pe)
- [Ubicania.com](https://ubicania.com)
