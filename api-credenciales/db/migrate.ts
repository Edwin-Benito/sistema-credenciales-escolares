import db from './database';

console.log('Ejecutando migración inicial...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Grados (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Grupos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grado_id INTEGER NOT NULL,
    letra TEXT NOT NULL,
    FOREIGN KEY (grado_id) REFERENCES Grados(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS CiclosEscolares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    estatus TEXT NOT NULL DEFAULT 'inactivo'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT UNIQUE,
    nombres TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT,
    curp TEXT UNIQUE,
    fecha_nacimiento TEXT,
    estatus_general TEXT DEFAULT 'activo',
    tutor TEXT,
    telefono1 TEXT,
    telefono2 TEXT,
    tipo_sangre TEXT,
    domicilio TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER NOT NULL,
    grupo_id INTEGER NOT NULL,
    ciclo_escolar_id INTEGER NOT NULL,
    path_foto TEXT,
    FOREIGN KEY (alumno_id) REFERENCES Alumnos(id),
    FOREIGN KEY (grupo_id) REFERENCES Grupos(id),
    FOREIGN KEY (ciclo_escolar_id) REFERENCES CiclosEscolares(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS EscuelaInfo (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nombre_escuela TEXT DEFAULT 'Escuela Primaria Adolfo López Mateos',
    cct TEXT DEFAULT '13DPR1144D',
    direccion TEXT,
    telefono TEXT,
    datos_contacto_reverso TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT DEFAULT 'profesor',
    estatus TEXT NOT NULL DEFAULT 'activo'
  )`, (err) => {
    if (err) {
      console.error('Error al crear tablas:', err.message);
    } else {
      console.log('¡Migración completada! Todas las tablas han sido creadas.');
    }
    db.close();
  });
});
