# Documentación Técnica del Sistema de Credenciales Escolares

## 1. Stack Tecnológico y Versiones

### Frontend

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| Vue.js | 3.5.24 | Framework progresivo para construir interfaces de usuario reactivas. Utiliza Composition API para mejor organización del código y reutilización de lógica. |
| Vite | 7.2.2 | Herramienta de construcción moderna que ofrece inicio rápido del servidor de desarrollo y Hot Module Replacement (HMR) instantáneo. |
| TypeScript | 5.9.3 | Superset de JavaScript que añade tipado estático, mejorando la detección de errores en tiempo de desarrollo y facilitando el mantenimiento. |
| Vue Router | 4.6.3 | Sistema oficial de enrutamiento para Vue.js que permite la navegación entre vistas sin recargar la página (SPA). |
| Pinia | 3.0.4 | Store oficial de Vue para manejo de estado global de la aplicación, utilizado principalmente para autenticación y datos compartidos. |
| Axios | 1.13.2 | Cliente HTTP basado en promesas para realizar peticiones al backend API REST. |
| Tailwind CSS | 4.1.17 | Framework CSS utility-first para diseño rápido y consistente de la interfaz sin escribir CSS personalizado. |
| Vue TSC | 3.1.3 | Compilador de TypeScript específico para proyectos Vue que verifica tipos en archivos .vue. |

### Backend

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| Node.js | (Runtime) | Entorno de ejecución JavaScript del lado del servidor que permite usar JavaScript en el backend. |
| Express.js | 5.1.0 | Framework web minimalista y flexible para Node.js que facilita la creación de APIs REST con middleware. |
| TypeScript | 5.7.2 | Tipado estático también en el backend para mantener coherencia y reducir errores en toda la aplicación. |
| SQLite3 | 5.1.7 | Base de datos relacional embebida, sin servidor, ideal para aplicaciones de tamaño pequeño a mediano. No requiere instalación separada. |
| bcryptjs | 3.0.3 | Librería para hashing seguro de contraseñas usando el algoritmo bcrypt, protegiendo credenciales de usuarios. |
| jsonwebtoken | 9.0.2 | Implementación de JSON Web Tokens (JWT) para autenticación stateless y autorización basada en tokens. |
| ExcelJS | 4.4.0 | Librería para leer y escribir archivos Excel (.xlsx), usada para importación masiva de alumnos y generación de plantillas. |
| Multer | 2.0.2 | Middleware de Express para manejo de `multipart/form-data`, permite la carga de archivos Excel y fotos. |
| PDFKit | 0.17.2 | Librería para generación de documentos PDF programáticamente, utilizada para crear las credenciales escolares. |
| QRCode | 1.5.4 | Generador de códigos QR para incluir en las credenciales escolares con información del alumno. |
| CORS | 2.8.5 | Middleware para habilitar Cross-Origin Resource Sharing, permitiendo que el frontend consuma la API desde diferentes orígenes. |
| ts-node | 10.9.2 | Ejecutor de TypeScript para Node.js en desarrollo, permite ejecutar archivos .ts directamente sin compilar. |
| nodemon | 3.1.11 | Utilidad que reinicia automáticamente el servidor Node cuando detecta cambios en archivos, mejorando la experiencia de desarrollo. |

---

## 2. Modelo de Datos

El sistema utiliza una base de datos SQLite con las siguientes tablas relacionales:

### 2.1 Tabla: Grados

Almacena los grados escolares disponibles en la institución.

**Estructura:**
- `id` (INTEGER PRIMARY KEY): Identificador único del grado.
- `nombre` (TEXT NOT NULL): Nombre del grado (ej: "1°", "2°", "3°", "4°", "5°", "6°").

### 2.2 Tabla: Grupos

Define los grupos (secciones) dentro de cada grado.

**Estructura:**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único del grupo.
- `grado_id` (INTEGER NOT NULL): Referencia al grado al que pertenece este grupo.
- `letra` (TEXT NOT NULL): Identificador del grupo (ej: "A", "B", "C").

**Relaciones:**
- `grado_id` → `Grados.id` (Foreign Key): Cada grupo pertenece a un grado específico.

### 2.3 Tabla: CiclosEscolares

Registra los ciclos escolares para organizar inscripciones por año lectivo.

**Estructura:**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único del ciclo escolar.
- `nombre` (TEXT NOT NULL): Nombre descriptivo del ciclo (ej: "2024-2025").
- `estatus` (TEXT NOT NULL DEFAULT 'inactivo'): Estado del ciclo, puede ser 'activo' o 'inactivo'. Solo un ciclo debe estar activo a la vez.

### 2.4 Tabla: Alumnos

Contiene la información personal de los estudiantes.

**Estructura:**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único del alumno.
- `matricula` (TEXT UNIQUE): Número de matrícula del estudiante, debe ser único.
- `nombres` (TEXT NOT NULL): Nombre(s) del alumno.
- `apellido_paterno` (TEXT NOT NULL): Apellido paterno del alumno.
- `apellido_materno` (TEXT): Apellido materno del alumno (opcional).
- `curp` (TEXT UNIQUE): Clave Única de Registro de Población, debe ser única.
- `fecha_nacimiento` (TEXT): Fecha de nacimiento del alumno en formato ISO (YYYY-MM-DD).
- `estatus_general` (TEXT DEFAULT 'activo'): Estado del alumno ('activo' o 'inactivo').
- `tutor` (TEXT): Nombre del padre/madre/tutor responsable.
- `telefono1` (TEXT): Teléfono de contacto principal.
- `telefono2` (TEXT): Teléfono de contacto secundario (opcional).
- `tipo_sangre` (TEXT): Tipo de sangre del alumno (ej: "O+", "A-").
- `domicilio` (TEXT): Dirección completa del domicilio del alumno.

### 2.5 Tabla: Inscripciones

Relaciona alumnos con grupos en ciclos escolares específicos.

**Estructura:**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único de la inscripción.
- `alumno_id` (INTEGER NOT NULL): Referencia al alumno inscrito.
- `grupo_id` (INTEGER NOT NULL): Referencia al grupo en el que está inscrito.
- `ciclo_escolar_id` (INTEGER NOT NULL): Referencia al ciclo escolar correspondiente.
- `path_foto` (TEXT): Ruta relativa al archivo de fotografía del alumno para la credencial.

**Relaciones:**
- `alumno_id` → `Alumnos.id` (Foreign Key): Cada inscripción pertenece a un alumno.
- `grupo_id` → `Grupos.id` (Foreign Key): Cada inscripción está asociada a un grupo.
- `ciclo_escolar_id` → `CiclosEscolares.id` (Foreign Key): Cada inscripción corresponde a un ciclo escolar.

**Lógica de negocio:** Un alumno puede tener múltiples inscripciones en diferentes ciclos escolares, pero solo una por ciclo. Esta tabla permite el cambio de grupo sin perder el historial.

### 2.6 Tabla: EscuelaInfo

Almacena información institucional de la escuela.

**Estructura:**
- `id` (INTEGER PRIMARY KEY DEFAULT 1): Identificador único (fijo en 1, solo un registro).
- `nombre_escuela` (TEXT DEFAULT 'Escuela Primaria Adolfo López Mateos'): Nombre oficial de la institución.
- `cct` (TEXT DEFAULT '13DPR1144D'): Clave de Centro de Trabajo.
- `direccion` (TEXT): Dirección física de la escuela.
- `telefono` (TEXT): Teléfono de contacto de la institución.
- `datos_contacto_reverso` (TEXT): Información adicional para el reverso de las credenciales.

### 2.7 Tabla: Usuarios

Gestiona los usuarios del sistema con autenticación.

**Estructura:**
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único del usuario.
- `username` (TEXT UNIQUE NOT NULL): Nombre de usuario para inicio de sesión, debe ser único.
- `password_hash` (TEXT NOT NULL): Hash bcrypt de la contraseña del usuario (nunca se almacena en texto plano).
- `rol` (TEXT DEFAULT 'profesor'): Rol del usuario ('admin' o 'profesor'), determina permisos.
- `estatus` (TEXT NOT NULL DEFAULT 'activo'): Estado del usuario ('activo' o 'inactivo').

**Seguridad:** Las contraseñas se almacenan hasheadas con bcrypt (10 rounds) y la autenticación se maneja mediante JWT.

### 2.8 Diagrama de Relaciones

```
Grados (1) ──────< (N) Grupos
                      │
                      │ (1)
                      │
                      ├──< (N) Inscripciones >── (N) Alumnos (1)
                      │
CiclosEscolares (1) ──┘

Usuarios (tabla independiente para autenticación)
EscuelaInfo (tabla singleton para configuración)
```

---

## 3. Historias de Usuario - Criterios de Aceptación Técnicos

### HU-01: Carga Masiva de Alumnos

**Descripción:** Como administrador del sistema, necesito importar listas completas de alumnos desde archivos Excel para agilizar el registro inicial de cada ciclo escolar.

**Criterios de Aceptación Técnicos:**

1. **Validación del archivo Excel:**
   - El sistema solo acepta archivos con extensión `.xlsx` o `.xls`
   - El archivo debe contener al menos las columnas obligatorias: `GRADO Y GRUPO` y `NOMBRE COMPLETO`
   - Se valida que el archivo sea un formato OOXML válido verificando el encabezado PK (bytes 0x50, 0x4B)
   - El sistema procesa un máximo de 2000 filas por archivo como medida de seguridad

2. **Columnas esperadas en el Excel:**
   - `GRADO Y GRUPO` (obligatorio): Formato "1° A", "2° B", etc.
   - `NOMBRE COMPLETO` (obligatorio): Nombre completo del alumno que será parseado automáticamente
   - `TUTOR` (opcional): Nombre del padre/madre/tutor
   - `TELEFONO 1` (opcional): Teléfono principal
   - `TELEFONO 2` (opcional): Teléfono secundario
   - `TIPO DE SANGRE` (opcional): Ej: "O+", "A-"
   - `DIRECION` (opcional): Domicilio del alumno (nota: columna con error ortográfico en la implementación actual)

3. **Modos de importación:**
   - **Masivo:** El Excel contiene múltiples grados/grupos. El sistema usa la columna "GRADO Y GRUPO" para distribuir alumnos automáticamente
   - **Individual:** Se selecciona un grado y grupo destino. Todos los alumnos del Excel se inscriben en ese grupo independientemente de la columna "GRADO Y GRUPO"

4. **Parseo automático de nombres:**
   - El sistema toma el valor de `NOMBRE COMPLETO` y lo divide en: nombres, apellido_paterno, apellido_materno
   - Si el nombre tiene 2 palabras: primera = nombres, segunda = apellido_paterno
   - Si tiene 3 o más palabras: primera = nombres, segunda = apellido_paterno, tercera = apellido_materno

5. **Generación automática de datos:**
   - CURP temporal se genera automáticamente para cada alumno (editable posteriormente)
   - Matrícula se genera automáticamente si no existe

6. **Validación de ciclo escolar:**
   - Es obligatorio seleccionar un ciclo escolar válido antes de importar
   - El ciclo debe existir en la base de datos

7. **Validación de grados y grupos:**
   - En modo masivo: los grados/grupos mencionados en el Excel deben existir previamente
   - En modo individual: es obligatorio seleccionar un grado y grupo destino

8. **Manejo de duplicados:**
   - El sistema verifica si el alumno ya existe comparando: nombres, apellido_paterno, apellido_materno
   - Si existe, actualiza sus datos (tutor, teléfonos, tipo de sangre, domicilio)
   - Si no existe, crea un nuevo registro

9. **Transaccionalidad:**
   - La importación se ejecuta en una transacción SQL (BEGIN IMMEDIATE TRANSACTION)
   - Si ocurre un error, se hace ROLLBACK y no se guardan cambios parciales
   - Si todo es exitoso, se hace COMMIT y se guardan todos los cambios

10. **Respuesta del sistema:**
    - Mensaje de éxito: "Importación completada con éxito. X alumnos procesados (Y creados, Z actualizados)."
    - En caso de error: detalle específico del problema (columna faltante, archivo inválido, etc.)

---

## 4. Descripción Funcional de Pantallas (Frontend)

### 4.1 Pantalla de Login (LoginView.vue)

**Propósito:** Autenticación de usuarios para acceder al sistema.

**Elementos de la interfaz:**

1. **Logo de la aplicación:**
   - Ícono circular con símbolo de escuela (material icon: 'school')
   - Posicionado en la parte superior central

2. **Título:** "Iniciar Sesión"

3. **Campo de Usuario:**
   - Label: "Usuario / Correo Electrónico"
   - Input tipo texto con ícono de persona
   - Placeholder: "Su correo electrónico"
   - Validación: campo requerido
   - Autocompletado habilitado (autocomplete="username")

4. **Campo de Contraseña:**
   - Label: "Contraseña"
   - Input tipo password con ícono de candado
   - Placeholder: "••••••••"
   - Botón de mostrar/ocultar contraseña (ojo/ojo tachado)
   - Validación: campo requerido
   - Autocompletado habilitado (autocomplete="current-password")

5. **Botón de envío:**
   - Texto: "Entrar" (cambia a "Entrando…" durante el proceso)
   - Se deshabilita mientras procesa la solicitud para evitar múltiples envíos

6. **Enlace "¿Olvidaste tu contraseña?"**
   - Ubicado debajo del botón de envío

7. **Área de mensajes de error:**
   - Se muestra solo si hay errores
   - Fondo rojo translúcido con borde
   - Muestra mensajes como: "Credenciales inválidas" o "Error al iniciar sesión"

**Flujo de interacción:**

1. El usuario ingresa sus credenciales (usuario y contraseña)
2. Al hacer clic en "Entrar" o presionar Enter:
   - Se valida que ambos campos estén llenos
   - Se limpia cualquier mensaje de error previo
   - Se deshabilita el botón y cambia a "Entrando…"
   - Se envía petición POST al endpoint `/api/auth/login`
   - Si es exitoso: se guarda el token JWT en el store de autenticación y redirige a `/dashboard`
   - Si falla: se muestra el mensaje de error recibido del servidor
   - Se rehabilita el botón

3. El botón de mostrar/ocultar contraseña alterna entre tipo "password" y "text"

**Validaciones frontend:**
- Ambos campos son obligatorios (atributo `required`)
- Se previenen envíos múltiples con la variable `isSubmitting`

**Diseño visual:**
- Fondo oscuro (#1e1e1e)
- Formulario centrado en pantalla
- Bordes redondeados y efectos de foco en inputs
- Paleta de colores oscura con acentos en color primario (primary)
- Responsive para dispositivos móviles y de escritorio

---

### 4.2 Pantalla de Importación (ImportarView.vue)

**Propósito:** Permitir la carga masiva de alumnos desde archivos Excel.

**Elementos de la interfaz:**

1. **Encabezado:**
   - Título: "Importar Alumnos desde Excel"

2. **Panel de instrucciones:**
   - Ícono informativo
   - Lista de instrucciones detalladas:
     * Explicación de modo masivo vs individual
     * Columnas requeridas en el Excel
     * Formato de datos esperados
     * Información sobre parseo automático de nombres
     * Nota sobre CURP temporal

3. **Selector de modo de importación:**
   - Radio buttons:
     * "Importación Masiva": Excel con todos los grados/grupos
     * "Importación por Grupo": Todos los alumnos a un grupo específico

4. **Formulario de selección (3 columnas):**
   
   **a) Ciclo Escolar (obligatorio):**
   - Select dropdown
   - Muestra ciclos disponibles con indicador "(Activo)" si aplica
   - Opción por defecto: "-- Selecciona un ciclo --"
   
   **b) Grado:**
   - Select dropdown
   - Obligatorio solo en modo individual
   - Deshabilitado en modo masivo
   - Opción por defecto: "-- Selecciona un grado --"
   
   **c) Grupo:**
   - Select dropdown
   - Obligatorio solo en modo individual
   - Deshabilitado en modo masivo o si no hay grado seleccionado
   - Se filtra dinámicamente según el grado seleccionado
   - Muestra letras de grupos disponibles

5. **Selector de archivo:**
   - Input file oculto (solo acepta .xlsx, .xls)
   - Botón personalizado: "Seleccionar Archivo" con ícono de carga
   - Texto informativo mostrando nombre y tamaño del archivo seleccionado
   - Si no hay archivo: "Ningún archivo seleccionado"

6. **Botón de envío:**
   - Texto: "Importar Alumnos" / "Importando…" (durante proceso)
   - Deshabilitado mientras procesa
   - Ícono de upload

7. **Área de mensajes:**
   - Mensajes de éxito (verde): confirmación con estadísticas
   - Mensajes de error (rojo): detalles del problema

**Flujo de interacción:**

1. **Selección de modo:**
   - Por defecto inicia en "Importación Masiva"
   - Al cambiar a "Individual": se habilitan y marcan como obligatorios los selects de Grado y Grupo
   - Al volver a "Masiva": se deshabilitan Grado y Grupo

2. **Carga de datos iniciales:**
   - Al montar el componente se cargan: ciclos escolares, grados y grupos desde la API

3. **Selección de grado (modo individual):**
   - Al seleccionar un grado, se filtran automáticamente los grupos disponibles para ese grado

4. **Selección de archivo:**
   - Click en botón dispara input file
   - Al seleccionar archivo: se muestra nombre y tamaño formateado (KB/MB)

5. **Envío del formulario:**
   - Validaciones automáticas de campos requeridos
   - Se crea un FormData con:
     * archivo Excel
     * ciclo_escolar_id
     * modo_importacion
     * grupo_id (solo si modo individual)
   - Se envía POST multipart/form-data a `/api/import/alumnos`
   - Durante proceso: botón deshabilitado y texto "Importando…"
   - Al completar:
     * Éxito: mensaje verde con estadísticas, resetea formulario
     * Error: mensaje rojo con detalle del problema

**Validaciones:**
- Ciclo escolar obligatorio siempre
- Grado y grupo obligatorios solo en modo individual
- Archivo Excel obligatorio
- Formato de archivo .xlsx o .xls

**Características adicionales:**
- Función `formatearTamano()`: convierte bytes a KB o MB
- Carga reactiva de grupos según grado seleccionado
- Limpieza de mensajes y formulario tras importación exitosa

---

### 4.3 Pantalla de Dashboard (DashboardView.vue)

**Propósito:** Página principal después del login, muestra resumen del sistema y accesos rápidos.

**Elementos esperados (basado en el patrón del sistema):**
- Tarjetas con estadísticas clave (total alumnos, grupos activos, ciclo actual)
- Enlaces rápidos a funciones principales
- Información del usuario logueado
- Navegación a diferentes módulos

---

### 4.4 Pantalla de Alumnos (AlumnosView.vue)

**Propósito:** Listado y búsqueda de alumnos registrados.

**Elementos esperados:**
- Tabla con listado de alumnos
- Filtros por grado, grupo, ciclo escolar
- Buscador por nombre/matrícula
- Botones de acción: ver detalle, editar, generar credencial
- Paginación si hay muchos registros

---

### 4.5 Pantalla de Detalle de Alumno (AlumnoDetalleView.vue)

**Propósito:** Visualizar y editar información completa de un alumno.

**Elementos esperados:**
- Formulario con todos los campos del alumno
- Sección de fotografía
- Historial de inscripciones por ciclo
- Botones: guardar cambios, cancelar, eliminar

---

### 4.6 Pantalla de Nuevo Alumno (AlumnoNuevoView.vue)

**Propósito:** Registro manual de un nuevo alumno.

**Elementos esperados:**
- Formulario con campos obligatorios y opcionales
- Validaciones en tiempo real
- Upload de fotografía
- Selección de grado, grupo y ciclo para inscripción inicial

---

### 4.7 Pantalla de Credenciales (CredencialesView.vue)

**Propósito:** Generación y descarga de credenciales escolares en PDF.

**Elementos esperados:**
- Filtros para seleccionar alumnos (por grupo, individual)
- Previsualización de credencial
- Botón de generar PDF
- Opciones de diseño/plantilla

---

### 4.8 Pantalla de Gestión de Ciclos (CiclosView.vue)

**Propósito:** Administrar ciclos escolares.

**Elementos esperados:**
- Listado de ciclos existentes
- Indicador de ciclo activo
- Formulario para crear nuevo ciclo
- Botones para activar/desactivar ciclos
- Validación: solo un ciclo activo a la vez

---

### 4.9 Pantalla de Gestión de Grados (GradosView.vue)

**Propósito:** Administrar grados escolares.

**Elementos esperados:**
- Listado de grados (1°, 2°, 3°, etc.)
- Formulario para agregar nuevos grados
- Opciones de edición/eliminación

---

### 4.10 Pantalla de Gestión de Grupos (GruposView.vue)

**Propósito:** Administrar grupos dentro de cada grado.

**Elementos esperados:**
- Listado organizado por grado
- Formulario para crear nuevo grupo
- Selección de grado padre
- Campo para letra del grupo (A, B, C, etc.)

---

### 4.11 Pantalla de Información de Escuela (EscuelaView.vue)

**Propósito:** Configurar datos institucionales.

**Elementos esperados:**
- Formulario con campos:
  * Nombre de la escuela
  * CCT
  * Dirección
  * Teléfono
  * Datos para reverso de credencial
- Botón guardar cambios

---

### 4.12 Pantalla de Inscripciones (InscribirView.vue)

**Propósito:** Inscribir alumnos existentes en grupos/ciclos.

**Elementos esperados:**
- Selector de alumno (búsqueda)
- Selector de ciclo escolar
- Selector de grado y grupo
- Validación de inscripciones duplicadas

---

### 4.13 Pantalla de Cambiar Grupo (CambiarGrupoView.vue)

**Propósito:** Reasignar alumnos a diferentes grupos dentro del mismo ciclo.

**Elementos esperados:**
- Selector de alumno
- Grupo actual (solo lectura)
- Selector de nuevo grupo
- Confirmación de cambio

---

## 5. Arquitectura del Sistema

### 5.1 Patrón Arquitectónico

El sistema sigue una arquitectura **Cliente-Servidor** con separación clara entre frontend y backend:

- **Frontend (SPA - Single Page Application):** Aplicación Vue.js que se ejecuta completamente en el navegador
- **Backend (API REST):** Servidor Node.js/Express que expone endpoints HTTP
- **Base de datos:** SQLite embebida en el servidor

### 5.2 Estructura de Directorios

**Backend (api-credenciales/):**
```
├── controllers/     # Lógica de negocio de cada módulo
├── db/             # Scripts de migración, seed y utilidades de BD
├── middleware/     # Autenticación, upload de archivos
├── routes/         # Definición de endpoints de la API
├── uploads/        # Archivos subidos (fotos de alumnos)
├── assets/         # Recursos estáticos (fuentes, plantillas)
└── index.ts        # Punto de entrada del servidor
```

**Frontend (frontend-credenciales/):**
```
├── src/
│   ├── api/        # Configuración de Axios
│   ├── components/ # Componentes reutilizables
│   ├── layouts/    # Layouts de página
│   ├── router/     # Configuración de rutas
│   ├── stores/     # Estado global (Pinia)
│   ├── views/      # Páginas/vistas principales
│   └── main.ts     # Punto de entrada de la aplicación
└── public/         # Recursos públicos estáticos
```

### 5.3 Flujo de Autenticación

1. Usuario ingresa credenciales en LoginView
2. Frontend envía POST a `/api/auth/login`
3. Backend valida usuario/password con bcrypt
4. Si es válido, genera JWT con payload: `{ userId, username, role }`
5. Backend retorna token al frontend
6. Frontend guarda token en store de Pinia y localStorage
7. Todas las peticiones posteriores incluyen header: `Authorization: Bearer <token>`
8. Middleware `authMiddleware` valida el token en cada petición protegida

### 5.4 Generación de PDFs (Credenciales)

1. Frontend solicita generación con filtros (grupo, alumnos específicos)
2. Backend consulta datos de alumnos + escuela + fotos
3. PDFKit crea documento programáticamente:
   - Dibuja layout de credencial
   - Inserta foto del alumno
   - Genera código QR con datos del alumno
   - Añade información de escuela
4. Backend retorna PDF como stream o archivo descargable
5. Frontend abre/descarga el archivo generado

---

## 6. Endpoints de la API

### 6.1 Autenticación

**POST /api/auth/login**
- Body: `{ username: string, password: string }`
- Respuesta: `{ token: string, user: { id, username, rol } }`

**POST /api/auth/register** (solo admin)
- Headers: `Authorization: Bearer <token>`
- Body: `{ username, password, rol }`
- Respuesta: `{ message, userId }`

### 6.2 Importación

**POST /api/import/alumnos**
- Headers: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data`
- Body:
  * `file`: archivo .xlsx
  * `ciclo_escolar_id`: number
  * `modo_importacion`: "masiva" | "individual"
  * `grupo_id`: number (opcional, requerido en modo individual)
- Respuesta: `{ message: "X alumnos procesados (Y creados, Z actualizados)" }`

### 6.3 Alumnos

**GET /api/alumnos**
- Query params: `?grado=X&grupo=Y&ciclo=Z&search=nombre`
- Respuesta: `[ { id, nombres, apellido_paterno, ... } ]`

**GET /api/alumnos/:id**
- Respuesta: `{ id, nombres, ..., inscripciones: [...] }`

**POST /api/alumnos**
- Body: `{ nombres, apellido_paterno, ... }`
- Respuesta: `{ id, message }`

**PUT /api/alumnos/:id**
- Body: campos a actualizar
- Respuesta: `{ message }`

**DELETE /api/alumnos/:id**
- Respuesta: `{ message }`

### 6.4 Ciclos, Grados, Grupos

Endpoints CRUD estándar para cada entidad siguiendo patrón REST.

---

## 7. Seguridad Implementada

1. **Autenticación JWT:** Stateless, tokens firmados con secreto
2. **Hashing de contraseñas:** bcrypt con 10 rounds
3. **Middleware de autenticación:** Protege rutas sensibles
4. **Validación de archivos:** Verifica formato OOXML antes de procesar
5. **Transacciones SQL:** Previene inconsistencias en importación masiva
6. **CORS configurado:** Solo permite orígenes autorizados
7. **Límites de procesamiento:** Máximo 2000 filas en importación Excel
8. **Prepared statements:** Prevención de inyección SQL (uso de placeholders en consultas)

---

## 8. Requisitos del Sistema

**Para ejecutar el backend:**
- Node.js 18+ 
- npm o yarn
- Sistema operativo: Windows, macOS o Linux

**Para ejecutar el frontend:**
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión al backend (configurada en axiosConfig.ts)

**Base de datos:**
- No requiere instalación (SQLite embebido)
- Archivo `database.sqlite` se crea automáticamente en primera ejecución

---

## 9. Instrucciones de Instalación

### Backend:
```bash
cd api-credenciales
npm install
npm run migrate     # Crear tablas
npm run seed        # Datos de prueba (opcional)
npm run dev         # Desarrollo con hot reload
npm run build       # Compilar TypeScript
npm start           # Producción
```

### Frontend:
```bash
cd frontend-credenciales
npm install
npm run dev         # Desarrollo (http://localhost:5173)
npm run build       # Compilar para producción
npm run preview     # Preview de build
```

---

**Documento generado automáticamente analizando el código fuente del proyecto.**
**Fecha: 4 de diciembre de 2025**
