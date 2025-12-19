import { Request, Response } from 'express';
import db from '../db/database';

// 1) Obtener TODOS los alumnos con su grupo/grado del ciclo ACTIVO (si existe)
export const getAllAlumnos = (req: Request, res: Response): void => {
  const sql = `
    SELECT 
      a.id,
      a.matricula,
      a.nombres,
      a.apellido_paterno,
      a.apellido_materno,
      a.estatus_general,
      g.letra AS grupo,
      gr.nombre AS grado
    FROM Alumnos a
    LEFT JOIN CiclosEscolares c ON c.estatus = 'activo'
    LEFT JOIN Inscripciones i ON i.alumno_id = a.id AND i.ciclo_escolar_id = c.id
    LEFT JOIN Grupos g ON g.id = i.grupo_id
    LEFT JOIN Grados gr ON gr.id = g.grado_id
    ORDER BY a.apellido_paterno, a.apellido_materno, a.nombres
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer alumnos', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

// 2) Crear un nuevo Alumno (solo datos perennes)
export const createAlumno = (req: Request, res: Response): void => {
  const { 
    matricula, nombres, apellido_paterno, apellido_materno, curp, fecha_nacimiento,
    tutor, telefono1, telefono2, tipo_sangre, domicilio
  } = req.body as {
    matricula?: string;
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    curp?: string;
    fecha_nacimiento?: string;
    tutor?: string;
    telefono1?: string;
    telefono2?: string;
    tipo_sangre?: string;
    domicilio?: string;
  };

  if (!nombres || !apellido_paterno || !curp || !fecha_nacimiento) {
    res.status(400).json({ message: 'Nombres, apellido_paterno, CURP y fecha_nacimiento son requeridos' });
    return;
  }

  const sql = `INSERT INTO Alumnos (
    matricula, nombres, apellido_paterno, apellido_materno, curp, fecha_nacimiento,
    tutor, telefono1, telefono2, tipo_sangre, domicilio
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const params = [
    matricula, nombres, apellido_paterno, apellido_materno, curp, fecha_nacimiento,
    tutor, telefono1, telefono2, tipo_sangre, domicilio
  ];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ message: 'Matrícula o CURP ya existen' });
        return;
      }
      res.status(500).json({ message: 'Error al crear el alumno', error: err.message });
      return;
    }
    res.status(201).json({ 
      id: this.lastID, 
      matricula, nombres, apellido_paterno, apellido_materno, curp, fecha_nacimiento,
      tutor, telefono1, telefono2, tipo_sangre, domicilio,
      estatus_general: 'activo' 
    });
  });
};

// 3) Obtener un Alumno por ID
export const getAlumnoById = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };
  const sql = 'SELECT * FROM Alumnos WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ message: 'Error al buscar alumno', error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Alumno no encontrado' });
      return;
    }
    res.status(200).json(row);
  });
};

// 4) Historial de Inscripciones por Alumno
export const getInscripcionesByAlumnoId = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };

  const sql = `
    SELECT 
      i.id,
      i.alumno_id,
      i.ciclo_escolar_id,
      i.grupo_id,
      i.path_foto,
      c.nombre AS ciclo_nombre,
      g.letra AS grupo_letra,
      gr.id AS grado_id,
      gr.nombre AS grado_nombre
    FROM Inscripciones i
    JOIN CiclosEscolares c ON c.id = i.ciclo_escolar_id
    JOIN Grupos g ON g.id = i.grupo_id
    JOIN Grados gr ON gr.id = g.grado_id
    WHERE i.alumno_id = ?
    ORDER BY c.nombre DESC
  `;

  db.all(sql, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer inscripciones', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};
