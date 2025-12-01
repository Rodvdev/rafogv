# Guía de Despliegue - Talleres Lima

## ⚠️ Error Común: DATABASE_URL no encontrada

Si ves este error:
```
Environment variable not found: DATABASE_URL
```

**Solución:** Configura la variable de entorno `DATABASE_URL` en tu plataforma de hosting.

## 📋 Checklist de Despliegue

### 1. Variables de Entorno Requeridas

Configura estas variables en tu plataforma de hosting:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string de PostgreSQL | `postgresql://user:pass@host:5432/db?schema=public` |
| `AUTH_SECRET` | Secret para NextAuth (genera uno único) | `openssl rand -base64 32` |

### 2. Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Environment Variables**
3. Agrega cada variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Tu connection string de PostgreSQL
   - **Environment:** Production, Preview, Development (según necesites)
4. Repite para `AUTH_SECRET`
5. **Redeploy** el proyecto para que los cambios surtan efecto

### 3. Configuración en Railway

1. Ve a tu proyecto en Railway
2. Navega a **Variables**
3. Agrega las variables de entorno
4. Railway detectará los cambios automáticamente

### 4. Configuración en Render

1. Ve a tu servicio en Render
2. Navega a **Environment**
3. Agrega las variables de entorno
4. Guarda y redeploy

### 5. Base de Datos PostgreSQL

Opciones recomendadas:

- **Vercel Postgres**: Integración nativa con Vercel
- **Supabase**: Gratis hasta cierto límite
- **Railway**: Fácil de configurar
- **Neon**: Serverless PostgreSQL
- **Render**: PostgreSQL managed

### 6. Ejecutar Migraciones

Después de configurar `DATABASE_URL`, ejecuta las migraciones:

```bash
# En tu entorno de producción o localmente con DATABASE_URL de producción
npm run prisma:migrate:deploy
```

### 7. Ejecutar Seeds (Opcional)

```bash
npm run prisma:seed
npm run prisma:seed-users
```

## 🔍 Verificación

Después del deploy, verifica:

1. ✅ La aplicación carga sin errores
2. ✅ Puedes acceder a `/signin`
3. ✅ Puedes iniciar sesión con las credenciales del seed
4. ✅ El dashboard muestra los datos correctamente

## 🐛 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- **Causa:** Variable no configurada en el entorno de producción
- **Solución:** Agrega `DATABASE_URL` en las variables de entorno de tu plataforma

### Error: "AUTH_SECRET or NEXTAUTH_SECRET must be set in production"
- **Causa:** Falta el secret de autenticación
- **Solución:** Genera uno con `openssl rand -base64 32` y agrégalo como `AUTH_SECRET`

### Error: "Can't reach database server"
- **Causa:** La base de datos no es accesible o la connection string es incorrecta
- **Solución:** Verifica la connection string y que la base de datos permita conexiones externas

### Error: "Prisma schema validation error"
- **Causa:** El schema de Prisma no está sincronizado con la base de datos
- **Solución:** Ejecuta `npm run prisma:migrate:deploy`

