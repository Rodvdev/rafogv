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
2. **IMPORTANTE**: Agrega las variables de entorno en la configuración del proyecto:
   - Ve a **Settings** → **Environment Variables**
   - Agrega las siguientes variables:
   
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
   AUTH_SECRET=tu-secret-generado-con-openssl-rand-base64-32
   ```
   
   ⚠️ **CRÍTICO**: Sin `DATABASE_URL`, la aplicación fallará con el error:
   ```
   Environment variable not found: DATABASE_URL
   ```

3. **Generar AUTH_SECRET para producción:**
   ```bash
   openssl rand -base64 32
   ```
   Copia el resultado y úsalo como valor de `AUTH_SECRET`

4. **Configurar Base de Datos:**
   - Usa una base de datos PostgreSQL (Vercel Postgres, Supabase, Railway, etc.)
   - Copia la connection string y úsala como `DATABASE_URL`
   - Ejemplo de formato: `postgresql://user:password@host:5432/dbname?schema=public`

5. **Ejecutar migraciones en producción:**
   ```bash
   npm run prisma:migrate:deploy
   ```

6. **Ejecutar seed (opcional):**
   ```bash
   npm run prisma:seed
   npm run prisma:seed-users
   ```

### Otras Plataformas

Para cualquier plataforma de hosting (Railway, Render, etc.), asegúrate de:
1. Configurar las variables de entorno `DATABASE_URL` y `AUTH_SECRET`
2. Ejecutar las migraciones de Prisma antes del primer deploy
3. Verificar que la base de datos esté accesible desde el entorno de producción

## 📝 Fuentes Principales

- [TallerMec.net.pe](https://tallermec.net.pe)
- [Páginas Amarillas](https://www.paginasamarillas.com.pe)
- [Ubicania.com](https://ubicania.com)
