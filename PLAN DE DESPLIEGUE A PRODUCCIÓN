# 🚀 PLAN DE DESPLIEGUE A PRODUCCIÓN
## Sistema de Credenciales Escolares

**Fecha objetivo:** 7 de enero de 2026  
**Plataforma:** Vercel  
**Estado:** En preparación  

---

## 📋 RESUMEN EJECUTIVO

Este documento detalla el plan completo para el despliegue del Sistema de Credenciales Escolares en producción utilizando Vercel como plataforma de hosting.

### **Módulos listos para producción:**
- ✅ Sistema de Autenticación y Autorización
- ✅ Gestión de Usuarios con Roles y Permisos
- ✅ Gestión de Alumnos
- ✅ Gestión de Ciclos Escolares
- ✅ Gestión de Grados y Grupos
- ✅ Sistema de Inscripciones
- ✅ Generación de Credenciales en PDF
- ✅ Importación masiva de datos
- ✅ Sistema de Backup y Restauración

---

## 🎯 OBJETIVOS DEL DESPLIEGUE

1. **Disponibilidad 24/7** del sistema en producción
2. **Migración segura** de SQLite a PostgreSQL
3. **Configuración correcta** de variables de entorno
4. **Rendimiento óptimo** en todas las funcionalidades
5. **Seguridad robusta** en autenticación y autorización

---

## 📅 CRONOGRAMA DE DESPLIEGUE

### **Fase 1: Preparación (1-2 enero 2026)**
- [ ] Migración de base de datos SQLite → PostgreSQL
- [ ] Configuración de variables de entorno
- [ ] Adaptación del código para producción
- [ ] Pruebas locales con PostgreSQL

### **Fase 2: Configuración Vercel (3-4 enero 2026)**
- [ ] Creación del proyecto en Vercel
- [ ] Configuración de base de datos en Vercel Postgres
- [ ] Deploy de prueba en staging
- [ ] Configuración de dominios

### **Fase 3: Despliegue Final (5-6 enero 2026)**
- [ ] Deploy final a producción
- [ ] Migración de datos de prueba
- [ ] Pruebas exhaustivas en producción
- [ ] Documentación final

### **Fase 4: Go Live (7 enero 2026)**
- [ ] Puesta en marcha oficial
- [ ] Monitoreo intensivo
- [ ] Soporte técnico activo

---

## 🛠 PREPARACIÓN TÉCNICA

### **1. Migración de Base de Datos**

#### **1.1 Cambios en el Backend**
```typescript
// Actual: SQLite
import Database from 'better-sqlite3';

// Nuevo: PostgreSQL con Prisma o pg
import { Pool } from 'pg';
```

#### **1.2 Scripts de Migración**
- [ ] `migrate_to_postgres.ts` - Script de migración automática
- [ ] `verify_migration.ts` - Verificación de integridad de datos
- [ ] `rollback_migration.ts` - Plan de rollback si es necesario

#### **1.3 Schema PostgreSQL**
```sql
-- Tabla Usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  estatus VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Permisos
CREATE TABLE permisos (
  id SERIAL PRIMARY KEY,
  rol VARCHAR(50) NOT NULL,
  accion VARCHAR(100) NOT NULL,
  permitido BOOLEAN DEFAULT FALSE,
  UNIQUE(rol, accion)
);

-- ... resto de tablas
```

### **2. Variables de Entorno**

#### **2.1 Backend (.env.production)**
```bash
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/credenciales_prod"
POSTGRES_HOST="vercel-postgres-host"
POSTGRES_DB="credenciales_prod"
POSTGRES_USER="production_user"
POSTGRES_PASSWORD="secure_password_2026"

# JWT y Seguridad
JWT_SECRET="super_secure_jwt_secret_production_2026"
JWT_EXPIRES_IN="24h"
BCRYPT_ROUNDS=12

# Configuración del servidor
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://credenciales-escolares.vercel.app"

# Uploads y archivos
MAX_FILE_SIZE="10MB"
ALLOWED_FILE_TYPES="image/jpeg,image/png,application/pdf"
UPLOAD_PATH="/tmp/uploads"

# Email (si se implementa)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="sistema@escuela.com"
SMTP_PASS="app_password"
```

#### **2.2 Frontend (.env.production)**
```bash
VITE_API_URL="https://api-credenciales.vercel.app"
VITE_APP_TITLE="Sistema de Credenciales Escolares"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT="production"
```

### **3. Configuración de Vercel**

#### **3.1 vercel.json - Backend**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **3.2 vercel.json - Frontend**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 🔧 CONFIGURACIÓN ESPECÍFICA DE PRODUCCIÓN

### **1. Adaptaciones de Código**

#### **1.1 Database Connection (database.ts)**
```typescript
// Antes (SQLite)
import Database from 'better-sqlite3';
const db = new Database('database.sqlite');

// Después (PostgreSQL)
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

#### **1.2 File Uploads (Vercel)**
```typescript
// Usar almacenamiento temporal en /tmp
const uploadPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads' 
  : './uploads';
```

#### **1.3 CORS Configuration**
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://credenciales-escolares.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

### **2. Optimizaciones de Build**

#### **2.1 Frontend Build**
```bash
npm run build
# Genera archivos optimizados en /dist
# Minificación automática
# Tree shaking de dependencias
```

#### **2.2 Backend Build**
```bash
npm run build
# Transpila TypeScript a JavaScript
# Optimizaciones de producción
```

---

## 🧪 PLAN DE PRUEBAS

### **Pruebas Pre-Despliegue**
- [ ] **Autenticación y Autorización**
  - Login con todos los roles
  - Verificación de permisos por módulo
  - Expiración de tokens JWT

- [ ] **Gestión de Alumnos**
  - CRUD completo de alumnos
  - Carga masiva de datos
  - Generación de credenciales

- [ ] **Base de Datos**
  - Conexión a PostgreSQL
  - Integridad referencial
  - Backup y restore

- [ ] **Performance**
  - Tiempo de carga < 3 segundos
  - Queries optimizadas
  - Manejo de archivos grandes

### **Pruebas Post-Despliegue**
- [ ] **Funcionalidad completa** en producción
- [ ] **Rendimiento** bajo carga real
- [ ] **Seguridad** - penetration testing básico
- [ ] **Backup automático** funcionando

---

## 🚨 PLAN DE CONTINGENCIA

### **Rollback Strategy**
1. **Rollback de Código**
   ```bash
   # Revertir a versión anterior en Vercel
   vercel --prod --rollback
   ```

2. **Rollback de Base de Datos**
   ```sql
   -- Restaurar desde backup más reciente
   pg_restore --clean --create backup_pre_migration.dump
   ```

3. **Comunicación**
   - Notificar a usuarios sobre el mantenimiento
   - Tiempo estimado de recuperación: 1-2 horas

### **Escenarios de Contingencia**
- **Base de datos inaccesible**: Usar backup local temporal
- **Vercel down**: Documentar procedimiento para hosting alternativo
- **Errores críticos**: Rollback automático activado

---

## 📊 MONITOREO POST-DESPLIEGUE

### **Métricas Clave**
- **Uptime**: > 99.5%
- **Response Time**: < 2 segundos promedio
- **Error Rate**: < 1%
- **Database Connections**: Monitoreo continuo

### **Alertas Configuradas**
- Error 500 > 5 ocurrencias/min
- Response time > 5 segundos
- Database connection timeout
- Disco lleno > 85%

### **Logs y Debugging**
```javascript
// Logger de producción
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});
```

---

## 📝 CHECKLIST FINAL PRE-DESPLIEGUE

### **Backend Checklist**
- [ ] Código transpilado sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL conectada
- [ ] Migraciones ejecutadas correctamente
- [ ] Seeds de producción aplicados
- [ ] CORS configurado para dominio de producción
- [ ] Rate limiting activado
- [ ] Logs de producción configurados

### **Frontend Checklist**  
- [ ] Build de producción exitoso
- [ ] Variables de entorno de producción
- [ ] API endpoints apuntando a producción
- [ ] Assets optimizados (imágenes, fonts)
- [ ] Service worker configurado (si aplica)
- [ ] Meta tags y SEO básico
- [ ] Responsive design verificado

### **Infraestructura Checklist**
- [ ] Dominio configurado y DNS propagado
- [ ] SSL certificate activo
- [ ] Backup automático programado
- [ ] Monitoreo de recursos configurado
- [ ] Alertas de sistema activas
- [ ] Documentación actualizada

---

## 👥 EQUIPO DE DESPLIEGUE

### **Roles y Responsabilidades**
- **Desarrollador Principal**: Benito (Lead Developer)
- **Testing**: Verificación completa de funcionalidades
- **DevOps**: Configuración de infraestructura en Vercel
- **Documentación**: Mantenimiento de esta documentación

### **Comunicación**
- **Canal principal**: Chat del proyecto
- **Escalación**: Issues críticos → Desarrollador Principal
- **Horarios críticos**: 8:00 AM - 6:00 PM (horario local)

---

## 📞 CONTACTOS DE EMERGENCIA

- **Soporte Vercel**: https://vercel.com/support
- **Documentación PostgreSQL**: https://www.postgresql.org/docs/
- **Repositorio del proyecto**: [URL del repositorio]

---

## 📈 POST-DESPLIEGUE

### **Semana 1 - Monitoring Intensivo**
- Revisión diaria de métricas
- Recopilación de feedback de usuarios
- Optimizaciones menores si es necesario

### **Semana 2-4 - Estabilización**  
- Monitoreo regular
- Implementación de mejoras reportadas
- Documentación de lecciones aprendidas

### **Mes 2+ - Mantenimiento Regular**
- Backups verificados semanalmente
- Updates de dependencias mensuales
- Revisión trimestral de seguridad

---

**Documento creado:** 1 de enero de 2026  
**Última actualización:** 1 de enero de 2026  
**Versión:** 1.0  
**Estado:** En preparación para despliegue del 7 enero 2026
