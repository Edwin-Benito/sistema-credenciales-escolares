# Plan de Módulos - Sistema de Gestión Escolar

## Fecha de creación: 16 de diciembre de 2025

---

## 📋 MÓDULOS PROPUESTOS POR EL USUARIO

### 1. Sistema de Roles y Permisos
**Estado:** 🔴 No implementado  
**Prioridad:** 🔥 CRÍTICA

#### Descripción
Sistema completo de control de acceso basado en roles con cuatro niveles de usuario:

#### Roles Definidos
1. **Administrador**
   - Acceso total sin restricciones
   - Gestión completa de usuarios
   - Backup y restauración de base de datos
   - Configuración del sistema

2. **Director**
   - Acceso casi total
   - Gestión de usuarios (excepto administradores)
   - Control de ciclos, grupos y grados
   - Visualización de reportes completos

3. **Profesor con Privilegios**
   - Inscribir/editar alumnos en cualquier momento
   - Crear y editar grupos
   - Generar credenciales grupales
   - Importar alumnos masivamente

4. **Profesor Normal**
   - Consultar alumnos de sus grupos
   - Generar credenciales individuales
   - Ver información básica
   - Solo inscribir en periodo activo

#### Tabla de Permisos Detallada

| Acción | Admin | Director | Prof. Privilegiado | Prof. Normal |
|--------|-------|----------|-------------------|--------------|
| **Gestión de Usuarios** |
| Crear usuarios | ✅ | ✅* | ❌ | ❌ |
| Editar usuarios | ✅ | ✅* | ❌ | ❌ |
| Eliminar usuarios | ✅ | ✅* | ❌ | ❌ |
| Cambiar roles | ✅ | ✅* | ❌ | ❌ |
| **Sistema** |
| Backup BD | ✅ | ✅ | ❌ | ❌ |
| Restaurar BD | ✅ | ✅ | ❌ | ❌ |
| Configurar escuela | ✅ | ✅ | ❌ | ❌ |
| Ver logs de auditoría | ✅ | ✅ | ❌ | ❌ |
| **Ciclos y Grupos** |
| Crear/editar ciclos | ✅ | ✅ | ✅ | ❌ |
| Crear/editar grupos | ✅ | ✅ | ✅ | ❌ |
| Eliminar grupos | ✅ | ✅ | ❌ | ❌ |
| **Alumnos** |
| Ver todos los alumnos | ✅ | ✅ | ✅ | 🟡 Solo sus grupos |
| Crear alumno | ✅ | ✅ | ✅ | ❌ |
| Editar datos alumno | ✅ | ✅ | ✅ | ❌ |
| Eliminar alumno | ✅ | ✅ | ❌ | ❌ |
| Cambiar estatus | ✅ | ✅ | ✅ | ❌ |
| Subir foto | ✅ | ✅ | ✅ | ❌ |
| Importar masivamente | ✅ | ✅ | ✅ | ❌ |
| **Inscripciones** |
| Inscribir (periodo activo) | ✅ | ✅ | ✅ | ✅ |
| Inscribir (fuera de periodo) | ✅ | ✅ | ✅ | ❌ |
| Cambiar de grupo | ✅ | ✅ | ✅ | ❌ |
| **Credenciales** |
| Generar individual | ✅ | ✅ | ✅ | ✅ |
| Generar por grupo | ✅ | ✅ | ✅ | ❌ |
| Editar plantilla | ✅ | ✅ | ❌ | ❌ |

*Director no puede gestionar usuarios con rol Administrador

#### Implementación Técnica

**Backend:**
- Tabla `permisos` con matriz de rol-acción
- Middleware `checkPermission(action)` para rutas
- Decorador `@RequiresRole(['admin', 'director'])`

**Frontend:**
- Guard `canActivate` en rutas protegidas
- Directiva `v-permission="'create_user'"` para botones
- Store de Pinia con permisos del usuario actual
- Menú dinámico según rol

**Base de Datos:**
```sql
CREATE TABLE permisos (
  id INTEGER PRIMARY KEY,
  rol TEXT NOT NULL,
  accion TEXT NOT NULL,
  permitido INTEGER DEFAULT 0,
  UNIQUE(rol, accion)
);
```

#### Tareas de Desarrollo
- [ ] Migración BD: tabla permisos
- [ ] Seeder de permisos por defecto
- [ ] Middleware de autorización
- [ ] Actualizar todas las rutas backend
- [ ] Guards en Vue Router
- [ ] Componente de gestión de usuarios mejorado
- [ ] Directiva v-permission
- [ ] Testing de permisos

**Tiempo estimado:** 2 semanas

---

### 2. Módulo de Inscripción y Reinscripción
**Estado:** 🔴 No implementado  
**Prioridad:** 🔥 ALTA

#### Descripción
Sistema completo para gestionar periodos de inscripción y reinscripción, con portal público para padres y panel administrativo para la escuela.

#### Funcionalidades Principales

##### A. Gestión de Periodos
**Panel Administrativo:**
- Crear periodos de inscripción/reinscripción
- Definir fechas de inicio/fin
- Activar/desactivar periodos
- Configurar si permite acceso público
- Establecer cupos por grado
- Documentos requeridos
- Configuración de validaciones

**Campos del Periodo:**
- Nombre del periodo
- Tipo (Inscripción nueva / Reinscripción)
- Ciclo escolar asociado
- Fecha inicio
- Fecha fin
- Estatus (Activo/Inactivo)
- Permite acceso público (Sí/No)
- Cupo total
- Requiere pago inmediato
- Lista de documentos obligatorios

##### B. Portal de Inscripción (Público/Padres)
**Características:**
- Acceso sin login (solo con periodo activo)
- Formulario paso a paso:
  1. **Datos del Alumno**
     - Nombres, apellidos
     - CURP
     - Fecha de nacimiento
     - Género
     - Lugar de nacimiento
     
  2. **Datos del Tutor**
     - Nombre completo
     - Parentesco
     - Teléfonos de contacto
     - Email
     - Dirección completa
     
  3. **Datos de Emergencia**
     - Tipo de sangre
     - Alergias
     - Enfermedades crónicas
     - Contacto de emergencia secundario
     
  4. **Selección de Grado**
     - Mostrar grados con cupo disponible
     - Información de horarios
     - Asignación automática a grupo
     
  5. **Documentos**
     - Subir documentos requeridos
     - Acta de nacimiento
     - CURP
     - Comprobante de domicilio
     - Cartilla de vacunación
     
  6. **Confirmación**
     - Resumen de datos
     - Número de folio de solicitud
     - Envío de confirmación por email/SMS

**Validaciones:**
- CURP único en el sistema
- Edad apropiada para el grado
- Cupo disponible
- Documentos completos
- Datos obligatorios

**Después de envío:**
- Genera folio único
- Envía email/SMS de confirmación
- Status: "Solicitud Pendiente"
- Notifica a administradores

##### C. Portal de Reinscripción
**Acceso:**
- Búsqueda por CURP del alumno
- Validación de datos básicos

**Proceso:**
1. **Búsqueda de Alumno**
   - Ingresa CURP
   - Valida que existe en el sistema
   - Muestra datos actuales
   
2. **Actualización de Datos**
   - Pre-llena formulario con datos existentes
   - Permite editar:
     - Teléfonos
     - Dirección
     - Datos de emergencia
     - Documentos actualizados
   
3. **Selección de Grupo**
   - Muestra grado que le corresponde
   - Permite elegir turno (si aplica)
   - Asignación a grupo
   
4. **Confirmación**
   - Actualiza datos en BD
   - Crea inscripción para nuevo ciclo
   - Envía confirmación

##### D. Panel Administrativo de Solicitudes
**Dashboard:**
- Total de solicitudes recibidas
- Solicitudes pendientes de revisar
- Solicitudes aprobadas
- Solicitudes rechazadas
- Cupos disponibles por grado
- Gráfica de inscripciones por día

**Gestión de Solicitudes:**
- Lista de todas las solicitudes
- Filtros por:
  - Estatus (Pendiente/Aprobado/Rechazado)
  - Grado solicitado
  - Fecha de solicitud
  - Documentos completos/incompletos
  
**Acciones por solicitud:**
- Ver detalle completo
- Aprobar (crea alumno en sistema)
- Rechazar (con motivo)
- Solicitar documentos adicionales
- Cambiar de grado/grupo
- Descargar documentos
- Enviar notificación al padre

**Automatización:**
- Aprobación automática si:
  - Documentos completos
  - Cupo disponible
  - Datos válidos
  - (Configurable por administrador)

##### E. Notificaciones
- Email de confirmación de recepción
- SMS con folio de solicitud
- Notificación de aprobación
- Recordatorio de documentos faltantes
- Aviso de fecha de inicio de clases

#### Estructura de Base de Datos

```sql
-- Tabla de periodos
CREATE TABLE periodos_inscripcion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('inscripcion', 'reinscripcion')),
  ciclo_escolar_id INTEGER NOT NULL,
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT NOT NULL,
  estatus TEXT DEFAULT 'inactivo' CHECK(estatus IN ('activo', 'inactivo')),
  permite_publico INTEGER DEFAULT 1,
  cupo_total INTEGER,
  requiere_pago INTEGER DEFAULT 0,
  configuracion TEXT, -- JSON con configuración adicional
  FOREIGN KEY (ciclo_escolar_id) REFERENCES CiclosEscolares(id)
);

-- Tabla de solicitudes de inscripción
CREATE TABLE solicitudes_inscripcion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folio TEXT UNIQUE NOT NULL,
  periodo_id INTEGER NOT NULL,
  
  -- Datos del alumno
  nombres TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  curp TEXT NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  genero TEXT,
  lugar_nacimiento TEXT,
  
  -- Datos del tutor
  tutor_nombre TEXT NOT NULL,
  tutor_parentesco TEXT NOT NULL,
  tutor_telefono1 TEXT NOT NULL,
  tutor_telefono2 TEXT,
  tutor_email TEXT,
  domicilio TEXT NOT NULL,
  
  -- Datos de emergencia
  tipo_sangre TEXT,
  alergias TEXT,
  enfermedades TEXT,
  contacto_emergencia TEXT,
  
  -- Académico
  grado_solicitado INTEGER NOT NULL,
  grupo_asignado INTEGER,
  
  -- Control
  estatus TEXT DEFAULT 'pendiente' CHECK(estatus IN ('pendiente', 'aprobada', 'rechazada')),
  motivo_rechazo TEXT,
  alumno_id INTEGER, -- Se llena al aprobar
  fecha_solicitud TEXT DEFAULT CURRENT_TIMESTAMP,
  fecha_revision TEXT,
  revisado_por INTEGER,
  
  -- Documentos
  documentos_completos INTEGER DEFAULT 0,
  
  FOREIGN KEY (periodo_id) REFERENCES periodos_inscripcion(id),
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (revisado_por) REFERENCES Usuarios(id),
  FOREIGN KEY (grado_solicitado) REFERENCES Grados(id),
  FOREIGN KEY (grupo_asignado) REFERENCES Grupos(id)
);

-- Tabla de documentos de solicitud
CREATE TABLE documentos_solicitud (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitud_id INTEGER NOT NULL,
  tipo_documento TEXT NOT NULL,
  nombre_archivo TEXT NOT NULL,
  ruta_archivo TEXT NOT NULL,
  fecha_subida TEXT DEFAULT CURRENT_TIMESTAMP,
  validado INTEGER DEFAULT 0,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes_inscripcion(id)
);

-- Tabla de configuración de documentos requeridos
CREATE TABLE documentos_requeridos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  periodo_id INTEGER NOT NULL,
  nombre_documento TEXT NOT NULL,
  obligatorio INTEGER DEFAULT 1,
  descripcion TEXT,
  orden INTEGER DEFAULT 0,
  FOREIGN KEY (periodo_id) REFERENCES periodos_inscripcion(id)
);
```

#### Endpoints API

**Periodos:**
```
POST   /api/periodos-inscripcion          Crear periodo
GET    /api/periodos-inscripcion          Listar periodos
GET    /api/periodos-inscripcion/:id      Detalle periodo
PUT    /api/periodos-inscripcion/:id      Editar periodo
DELETE /api/periodos-inscripcion/:id      Eliminar periodo
POST   /api/periodos-inscripcion/:id/activar   Activar periodo
POST   /api/periodos-inscripcion/:id/desactivar Desactivar periodo
GET    /api/periodos-inscripcion/activo   Obtener periodo activo
```

**Solicitudes (Público):**
```
GET    /api/inscripcion/periodo-activo    Verificar si hay periodo activo
POST   /api/inscripcion/solicitud         Enviar solicitud
GET    /api/inscripcion/folio/:folio      Consultar estatus por folio
POST   /api/inscripcion/reinscripcion     Buscar alumno para reinscribir
POST   /api/inscripcion/documentos        Subir documentos
```

**Solicitudes (Admin):**
```
GET    /api/solicitudes                   Listar solicitudes
GET    /api/solicitudes/:id               Detalle solicitud
POST   /api/solicitudes/:id/aprobar       Aprobar solicitud
POST   /api/solicitudes/:id/rechazar      Rechazar solicitud
PUT    /api/solicitudes/:id               Actualizar solicitud
GET    /api/solicitudes/estadisticas      Dashboard de solicitudes
POST   /api/solicitudes/:id/notificar     Enviar notificación
```

#### Vistas Frontend

**Admin:**
- `/periodos` - Gestión de periodos
- `/solicitudes` - Lista de solicitudes
- `/solicitudes/:id` - Detalle de solicitud
- `/solicitudes/estadisticas` - Dashboard

**Público:**
- `/inscripcion` - Formulario de inscripción
- `/reinscripcion` - Portal de reinscripción
- `/consulta-folio` - Consultar estatus

#### Tareas de Desarrollo
- [ ] Migraciones de BD (periodos, solicitudes, documentos)
- [ ] Backend: CRUD de periodos
- [ ] Backend: Endpoints de solicitudes públicas
- [ ] Backend: Endpoints de gestión de solicitudes
- [ ] Backend: Sistema de subida de documentos
- [ ] Backend: Generación de folios únicos
- [ ] Frontend: Vista de gestión de periodos
- [ ] Frontend: Formulario público de inscripción
- [ ] Frontend: Portal de reinscripción
- [ ] Frontend: Dashboard de solicitudes
- [ ] Frontend: Detalle y aprobación de solicitudes
- [ ] Sistema de notificaciones (email/SMS)
- [ ] Validaciones de CURP y cupos
- [ ] Testing E2E del flujo completo

**Tiempo estimado:** 3-4 semanas

---

## 🎯 MÓDULOS ADICIONALES PROPUESTOS

### 3. Expediente Digital del Alumno
**Estado:** 🔴 No implementado  
**Prioridad:** 🔥 ALTA

#### Descripción
Sistema de gestión documental para cada alumno, permitiendo almacenar, visualizar y gestionar todos los documentos relacionados con su expediente escolar.

#### Funcionalidades
- Subir documentos en PDF, JPG, PNG
- Categorización de documentos (Acta, CURP, Comprobantes, Médicos, etc.)
- Marcar documentos como obligatorios/opcionales
- Estado de completitud del expediente
- Historial de versiones de documentos
- Descarga individual o en lote
- Visor de PDF integrado
- Anotaciones en documentos
- Compartir expediente con permisos

#### Base de Datos
```sql
CREATE TABLE documentos_alumno (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER NOT NULL,
  categoria TEXT NOT NULL,
  nombre_documento TEXT NOT NULL,
  nombre_archivo TEXT NOT NULL,
  ruta_archivo TEXT NOT NULL,
  tipo_archivo TEXT,
  tamaño INTEGER,
  obligatorio INTEGER DEFAULT 0,
  validado INTEGER DEFAULT 0,
  validado_por INTEGER,
  fecha_validacion TEXT,
  version INTEGER DEFAULT 1,
  documento_anterior_id INTEGER,
  notas TEXT,
  fecha_subida TEXT DEFAULT CURRENT_TIMESTAMP,
  subido_por INTEGER NOT NULL,
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (validado_por) REFERENCES Usuarios(id),
  FOREIGN KEY (subido_por) REFERENCES Usuarios(id),
  FOREIGN KEY (documento_anterior_id) REFERENCES documentos_alumno(id)
);
```

**Tiempo estimado:** 1 semana

---

### 4. Gestión de Calificaciones
**Estado:** 🔴 No implementado  
**Prioridad:** 🟡 MEDIA

#### Descripción
Sistema completo para registro, cálculo y reporte de calificaciones escolares.

#### Funcionalidades
- Definir estructura de calificaciones (materias, periodos)
- Captura de calificaciones por materia/bimestre
- Cálculo automático de promedios
- Generación de boletas en PDF
- Historial académico completo
- Identificación de alumnos en riesgo
- Estadísticas por grupo/materia
- Exportación a Excel
- Gráficas de rendimiento

#### Base de Datos
```sql
CREATE TABLE materias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  clave TEXT UNIQUE,
  grado_id INTEGER NOT NULL,
  orden INTEGER DEFAULT 0,
  FOREIGN KEY (grado_id) REFERENCES Grados(id)
);

CREATE TABLE periodos_evaluacion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ciclo_escolar_id INTEGER NOT NULL,
  nombre TEXT NOT NULL, -- Bimestre 1, Trimestre 1, etc.
  numero INTEGER NOT NULL,
  fecha_inicio TEXT,
  fecha_fin TEXT,
  FOREIGN KEY (ciclo_escolar_id) REFERENCES CiclosEscolares(id)
);

CREATE TABLE calificaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER NOT NULL,
  materia_id INTEGER NOT NULL,
  periodo_id INTEGER NOT NULL,
  calificacion REAL NOT NULL,
  faltas INTEGER DEFAULT 0,
  observaciones TEXT,
  capturado_por INTEGER NOT NULL,
  fecha_captura TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (materia_id) REFERENCES materias(id),
  FOREIGN KEY (periodo_id) REFERENCES periodos_evaluacion(id),
  FOREIGN KEY (capturado_por) REFERENCES Usuarios(id),
  UNIQUE(alumno_id, materia_id, periodo_id)
);
```

**Tiempo estimado:** 2 semanas

---

### 5. Control de Asistencias
**Estado:** 🔴 No implementado  
**Prioridad:** 🟡 MEDIA-ALTA

#### Descripción
Registro diario de asistencia de alumnos con generación de reportes y alertas.

#### Funcionalidades
- Pase de lista diario por grupo
- Registro rápido (presente/falta/retardo/justificado)
- Justificantes de faltas
- Porcentaje de asistencia
- Alertas de inasistencias excesivas
- Reportes mensuales/bimestrales
- Exportación a Excel/PDF
- Gráficas de tendencias
- Notificaciones a padres por inasistencias

#### Base de Datos
```sql
CREATE TABLE asistencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  estatus TEXT NOT NULL CHECK(estatus IN ('presente', 'falta', 'retardo', 'justificado')),
  observaciones TEXT,
  registrado_por INTEGER NOT NULL,
  fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (registrado_por) REFERENCES Usuarios(id),
  UNIQUE(alumno_id, fecha)
);

CREATE TABLE justificantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asistencia_id INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  documento_path TEXT,
  fecha_subida TEXT DEFAULT CURRENT_TIMESTAMP,
  autorizado_por INTEGER,
  FOREIGN KEY (asistencia_id) REFERENCES asistencias(id),
  FOREIGN KEY (autorizado_por) REFERENCES Usuarios(id)
);
```

**Tiempo estimado:** 1.5 semanas

---

### 6. Comunicación Padres-Escuela
**Estado:** 🔴 No implementado  
**Prioridad:** 🟡 MEDIA

#### Descripción
Plataforma de comunicación bidireccional entre escuela y padres de familia.

#### Funcionalidades
- Envío de avisos generales o por grupo
- Notificaciones push/email/SMS
- Chat individual con padres
- Confirmación de lectura
- Envío de circulares con adjuntos
- Portal para padres (login limitado)
- Calendario de eventos visible para padres
- Encuestas y formularios
- Historial de comunicaciones

#### Base de Datos
```sql
CREATE TABLE avisos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo TEXT CHECK(tipo IN ('general', 'grupo', 'grado', 'individual')),
  enviado_por INTEGER NOT NULL,
  fecha_envio TEXT DEFAULT CURRENT_TIMESTAMP,
  adjunto_path TEXT,
  FOREIGN KEY (enviado_por) REFERENCES Usuarios(id)
);

CREATE TABLE destinatarios_aviso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aviso_id INTEGER NOT NULL,
  alumno_id INTEGER NOT NULL,
  leido INTEGER DEFAULT 0,
  fecha_lectura TEXT,
  FOREIGN KEY (aviso_id) REFERENCES avisos(id),
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id)
);

CREATE TABLE mensajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remitente_id INTEGER NOT NULL,
  destinatario_id INTEGER NOT NULL,
  alumno_relacionado INTEGER,
  mensaje TEXT NOT NULL,
  leido INTEGER DEFAULT 0,
  fecha_envio TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (remitente_id) REFERENCES Usuarios(id),
  FOREIGN KEY (destinatario_id) REFERENCES Usuarios(id),
  FOREIGN KEY (alumno_relacionado) REFERENCES Alumnos(id)
);
```

**Tiempo estimado:** 2 semanas

---

### 7. Reportes y Estadísticas Avanzadas
**Estado:** 🟡 Básico (solo dashboard simple)  
**Prioridad:** 🟡 MEDIA

#### Descripción
Dashboard completo con métricas, gráficas y exportación de reportes.

#### Funcionalidades
- Dashboard interactivo con KPIs
- Gráficas de inscripciones por ciclo
- Estadísticas de género, edad, estatus
- Comparativas entre ciclos
- Alumnos activos vs inactivos
- Distribución por grupo
- Eficiencia terminal
- Reportes de asistencias
- Reportes de calificaciones
- Reportes de pagos
- Exportación personalizada a Excel/PDF
- Programación de reportes automáticos

**Tiempo estimado:** 1.5 semanas

---

### 8. Calendario Escolar
**Estado:** 🔴 No implementado  
**Prioridad:** 🟢 BAJA-MEDIA

#### Descripción
Gestión de eventos, actividades y fechas importantes del calendario escolar.

#### Funcionalidades
- Crear eventos escolares
- Categorías (Festivo, Junta, Suspensión, Evaluación, Evento)
- Asociar eventos a grupos específicos o generales
- Recordatorios automáticos
- Vista de calendario mensual/semanal
- Sincronización con Google Calendar (opcional)
- Exportar a iCal
- Notificaciones de próximos eventos

#### Base de Datos
```sql
CREATE TABLE eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT,
  todo_el_dia INTEGER DEFAULT 1,
  categoria TEXT,
  color TEXT DEFAULT '#3B82F6',
  tipo_destinatario TEXT CHECK(tipo_destinatario IN ('todos', 'grado', 'grupo')),
  grado_id INTEGER,
  grupo_id INTEGER,
  creado_por INTEGER NOT NULL,
  fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grado_id) REFERENCES Grados(id),
  FOREIGN KEY (grupo_id) REFERENCES Grupos(id),
  FOREIGN KEY (creado_por) REFERENCES Usuarios(id)
);
```

**Tiempo estimado:** 1 semana

---

### 9. Control de Pagos
**Estado:** 🔴 No implementado  
**Prioridad:** 🟡 MEDIA (si la escuela cobra colegiaturas)

#### Descripción
Sistema de gestión de pagos escolares (inscripciones, colegiaturas, materiales, uniformes).

#### Funcionalidades
- Definir conceptos de pago
- Configurar montos por ciclo
- Registro de pagos
- Generación de recibos en PDF
- Control de adeudos
- Historial de pagos por alumno
- Reportes de ingresos
- Recordatorios de pagos pendientes
- Exportación a Excel
- Dashboard de ingresos

#### Base de Datos
```sql
CREATE TABLE conceptos_pago (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  monto_base REAL NOT NULL,
  ciclo_escolar_id INTEGER,
  obligatorio INTEGER DEFAULT 1,
  FOREIGN KEY (ciclo_escolar_id) REFERENCES CiclosEscolares(id)
);

CREATE TABLE pagos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER NOT NULL,
  concepto_id INTEGER NOT NULL,
  monto REAL NOT NULL,
  fecha_pago TEXT NOT NULL,
  metodo_pago TEXT,
  referencia TEXT,
  folio TEXT UNIQUE,
  registrado_por INTEGER NOT NULL,
  fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (concepto_id) REFERENCES conceptos_pago(id),
  FOREIGN KEY (registrado_por) REFERENCES Usuarios(id)
);

CREATE TABLE adeudos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER NOT NULL,
  concepto_id INTEGER NOT NULL,
  monto_pendiente REAL NOT NULL,
  fecha_vencimiento TEXT,
  estatus TEXT DEFAULT 'pendiente' CHECK(estatus IN ('pendiente', 'pagado', 'vencido')),
  FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
  FOREIGN KEY (concepto_id) REFERENCES conceptos_pago(id)
);
```

**Tiempo estimado:** 2 semanas

---

### 10. Auditoría y Logs del Sistema
**Estado:** 🔴 No implementado  
**Prioridad:** 🟡 MEDIA

#### Descripción
Sistema de registro de todas las acciones realizadas en el sistema para auditoría y seguridad.

#### Funcionalidades
- Registro automático de todas las acciones
- Filtros por usuario, fecha, módulo, acción
- Exportación de logs
- Alertas de acciones sospechosas
- Registro de intentos de login fallidos
- Historial de cambios en registros
- Restauración de datos desde logs (opcional)

#### Base de Datos
```sql
CREATE TABLE logs_auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  accion TEXT NOT NULL,
  modulo TEXT NOT NULL,
  descripcion TEXT,
  registro_afectado_id INTEGER,
  tabla_afectada TEXT,
  datos_anteriores TEXT, -- JSON
  datos_nuevos TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE intentos_login (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  exitoso INTEGER NOT NULL,
  ip_address TEXT,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Tiempo estimado:** 1 semana

---

### 11. Actividades Extraescolares
**Estado:** 🔴 No implementado  
**Prioridad:** 🟢 BAJA

#### Descripción
Gestión de talleres, clubes y actividades deportivas fuera del horario regular.

#### Funcionalidades
- Crear actividades extraescolares
- Definir horarios y cupos
- Inscripción de alumnos
- Control de asistencia a actividades
- Instructores/responsables
- Certificados de participación
- Reportes de participación

**Tiempo estimado:** 1.5 semanas

---

### 12. Biblioteca/Inventario Escolar
**Estado:** 🔴 No implementado  
**Prioridad:** 🟢 BAJA

#### Descripción
Control de libros de texto, materiales didácticos y mobiliario escolar.

#### Funcionalidades
- Catálogo de libros y materiales
- Préstamo de materiales
- Control de devoluciones
- Inventario de mobiliario
- Solicitudes de materiales
- Reportes de faltantes
- Historial de préstamos

**Tiempo estimado:** 1.5 semanas

---

### 13. Control de Salud y Seguridad
**Estado:** 🟡 Parcial (solo tipo de sangre en emergencia)  
**Prioridad:** 🟢 BAJA-MEDIA

#### Descripción
Gestión de información médica y de salud de los alumnos.

#### Funcionalidades
- Registro de alergias
- Enfermedades crónicas
- Medicamentos autorizados
- Cartilla de vacunación
- Consultas médicas en escuela
- Incidentes médicos
- Contactos de emergencia adicionales
- Protocolos de emergencia

**Tiempo estimado:** 1 semana

---

## 📊 RESUMEN DE PRIORIDADES

### Fase 1 - INMEDIATO (1-2 meses)
1. 🔥 **Sistema de Roles y Permisos** (2 semanas)
2. 🔥 **Módulo Inscripción/Reinscripción** (3-4 semanas)
3. 🔥 **Expediente Digital** (1 semana)
4. 🟡 **Comunicación Padres-Escuela** (2 semanas)

**Total Fase 1:** 8-9 semanas

### Fase 2 - CORTO PLAZO (2-4 meses)
5. 🟡 **Gestión de Calificaciones** (2 semanas)
6. 🟡 **Control de Asistencias** (1.5 semanas)
7. 🟡 **Reportes Avanzados** (1.5 semanas)
8. 🟡 **Auditoría y Logs** (1 semana)

**Total Fase 2:** 6 semanas

### Fase 3 - MEDIANO PLAZO (4-6 meses)
9. 🟡 **Control de Pagos** (2 semanas) - si aplica
10. 🟢 **Calendario Escolar** (1 semana)
11. 🟢 **Control de Salud** (1 semana)
12. 🟢 **Actividades Extraescolares** (1.5 semanas)
13. 🟢 **Biblioteca/Inventario** (1.5 semanas)

**Total Fase 3:** 7 semanas

---

## 🛠️ CONSIDERACIONES TÉCNICAS

### Stack Tecnológico Actual
- **Backend:** Node.js + Express + TypeScript + SQLite
- **Frontend:** Vue 3 + TypeScript + Vite + Tailwind CSS
- **Autenticación:** JWT
- **Generación PDF:** PDFKit

### Migraciones Necesarias
- Todas las nuevas tablas deben tener migraciones en `/db/`
- Seeders para datos de prueba
- Scripts de rollback en caso de errores

### Testing
- Unit tests para lógica de negocio crítica
- Integration tests para APIs
- E2E tests para flujos completos (inscripción, calificaciones)

### Seguridad
- Validación exhaustiva en backend
- Sanitización de inputs
- Rate limiting en endpoints públicos
- CORS configurado correctamente
- Encriptación de datos sensibles

### Escalabilidad
- Considerar migración a PostgreSQL si el sistema crece
- Implementar caché (Redis) para reportes pesados
- Optimizar queries con índices
- Paginación en todas las listas

---

## 📝 NOTAS FINALES

Este plan es flexible y puede ajustarse según:
- Recursos disponibles (desarrolladores, tiempo)
- Necesidades urgentes de la escuela
- Feedback de usuarios finales
- Restricciones técnicas o presupuestarias

**Siguiente paso recomendado:** Comenzar con Sistema de Roles y Permisos, ya que es la base para todos los demás módulos.
