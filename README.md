# Sistema de Gestión Escolar - Credenciales

Sistema completo de gestión escolar con generación de credenciales estudiantiles.

## 🚀 Tecnologías

### Backend
- Node.js + Express
- TypeScript
- SQLite
- PDFKit (generación de PDFs)
- JWT (autenticación)

### Frontend
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia (state management)

## 📋 Características Actuales

- ✅ Autenticación de usuarios
- ✅ Gestión de alumnos (CRUD)
- ✅ Gestión de ciclos escolares
- ✅ Gestión de grados y grupos
- ✅ Gestión de inscripciones
- ✅ Importación masiva desde Excel
- ✅ Generación de credenciales (individual y por grupo)
- ✅ Subida de fotos
- ✅ Backup y restauración de base de datos
- ✅ Datos de emergencia en credenciales

## 🛠️ Instalación

### Backend
```bash
cd api-credenciales
npm install
npm run migrate
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend-credenciales
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
proyecto/
├── api-credenciales/          # Backend API
│   ├── controllers/           # Controladores
│   ├── routes/               # Rutas de la API
│   ├── middleware/           # Middlewares
│   ├── db/                   # Base de datos y migraciones
│   ├── assets/               # Plantillas y fuentes
│   └── uploads/              # Archivos subidos
│
└── frontend-credenciales/    # Frontend Vue
    ├── src/
    │   ├── views/           # Vistas de la aplicación
    │   ├── components/      # Componentes reutilizables
    │   ├── stores/          # Stores de Pinia
    │   ├── router/          # Configuración de rutas
    │   └── api/             # Cliente API
    └── public/              # Archivos estáticos
```

## 🔐 Usuario por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

## 📝 Próximos Módulos

Ver [PLAN_MODULOS.md](PLAN_MODULOS.md) para el plan completo de desarrollo.

### Fase 1 - Inmediato
1. Sistema de Roles y Permisos
2. Módulo de Inscripción/Reinscripción
3. Expediente Digital
4. Comunicación Padres-Escuela

## 🌿 Flujo de Trabajo Git

### Ramas Principales
- `main` → Código en producción (estable)
- `develop` → Código en desarrollo

### Crear Nueva Funcionalidad
```bash
# Desde develop, crear rama de feature
git checkout develop
git pull origin develop
git checkout -b feature/nombre-modulo

# Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# Subir a GitHub
git push origin feature/nombre-modulo

# Crear Pull Request a develop en GitHub
```

### Pasar de Develop a Main (Release)
```bash
git checkout main
git merge develop
git push origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

