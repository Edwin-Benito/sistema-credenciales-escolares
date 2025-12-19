import { Response } from 'express';
import db from '../db/database';
import { AuthRequest } from '../middleware/authMiddleware';

export const uploadFotoInscripcion = (req: AuthRequest, res: Response): void => {
  const { id } = req.params as { id: string };

  if (!req.file) {
    res.status(400).json({ message: 'No se subió ningún archivo' });
    return;
  }

  const filePath = `fotos/${req.file.filename}`;

  const sql = 'UPDATE Inscripciones SET path_foto = ? WHERE id = ?';
  db.run(sql, [filePath, id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al actualizar la base de datos', error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Inscripción no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Foto actualizada correctamente', path: filePath });
  });
};

export const cambiarGrupo = (req: AuthRequest, res: Response): void => {
  const { alumno_id, ciclo_escolar_id, nuevo_grupo_id } = req.body;

  if (!alumno_id || !ciclo_escolar_id || !nuevo_grupo_id) {
    res.status(400).json({ message: 'Faltan datos requeridos: alumno_id, ciclo_escolar_id, nuevo_grupo_id' });
    return;
  }

  // Verificar que existe la inscripción
  const sqlCheck = `
    SELECT id FROM Inscripciones
    WHERE alumno_id = ? AND ciclo_escolar_id = ?
  `;

  db.get(sqlCheck, [alumno_id, ciclo_escolar_id], (err, inscripcion: any) => {
    if (err) {
      res.status(500).json({ message: 'Error al verificar inscripción', error: err.message });
      return;
    }

    if (!inscripcion) {
      res.status(404).json({ message: 'No existe una inscripción para este alumno en el ciclo seleccionado' });
      return;
    }

    // Actualizar el grupo
    const sqlUpdate = 'UPDATE Inscripciones SET grupo_id = ? WHERE id = ?';
    db.run(sqlUpdate, [nuevo_grupo_id, inscripcion.id], function (updateErr) {
      if (updateErr) {
        res.status(500).json({ message: 'Error al cambiar grupo', error: updateErr.message });
        return;
      }

      res.status(200).json({ 
        message: 'Grupo actualizado correctamente',
        inscripcion_id: inscripcion.id,
        nuevo_grupo_id
      });
    });
  });
};

export const crearInscripcion = (req: AuthRequest, res: Response): void => {
  const { alumno_id, ciclo_escolar_id, grupo_id } = req.body;

  if (!alumno_id || !ciclo_escolar_id || !grupo_id) {
    res.status(400).json({ message: 'Faltan datos requeridos: alumno_id, ciclo_escolar_id, grupo_id' });
    return;
  }

  // Verificar si ya existe inscripción para este alumno en este ciclo Y grupo específico
  const sqlCheck = 'SELECT id FROM Inscripciones WHERE alumno_id = ? AND ciclo_escolar_id = ? AND grupo_id = ?';
  
  db.get(sqlCheck, [alumno_id, ciclo_escolar_id, grupo_id], (err, existing: any) => {
    if (err) {
      res.status(500).json({ message: 'Error al verificar inscripción', error: err.message });
      return;
    }

    if (existing) {
      res.status(409).json({ message: 'El alumno ya está inscrito en este grupo y ciclo escolar' });
      return;
    }

    // Crear nueva inscripción (solo con alumno_id, ciclo_escolar_id, grupo_id)
    const sqlInsert = 'INSERT INTO Inscripciones (alumno_id, ciclo_escolar_id, grupo_id) VALUES (?, ?, ?)';
    
    db.run(sqlInsert, [alumno_id, ciclo_escolar_id, grupo_id], function (insertErr) {
      if (insertErr) {
        res.status(500).json({ message: 'Error al crear inscripción', error: insertErr.message });
        return;
      }

      res.status(201).json({ 
        message: 'Inscripción creada correctamente',
        id: this.lastID,
        alumno_id,
        ciclo_escolar_id,
        grupo_id
      });
    });
  });
};

export const getInscripcionesPorCiclo = (req: AuthRequest, res: Response): void => {
  const { ciclo_id } = req.query as { ciclo_id?: string };

  if (!ciclo_id) {
    res.status(400).json({ message: 'ciclo_id es requerido' });
    return;
  }

  const sql = 'SELECT alumno_id FROM Inscripciones WHERE ciclo_escolar_id = ?';

  db.all(sql, [ciclo_id], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener inscripciones', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

export const eliminarInscripcion = (req: AuthRequest, res: Response): void => {
  const { id } = req.params as { id: string };

  if (!id) {
    res.status(400).json({ message: 'ID de inscripción es requerido' });
    return;
  }

  // Eliminar la inscripción (si tiene foto asociada, el campo se eliminará automáticamente)
  const sql = 'DELETE FROM Inscripciones WHERE id = ?';
  
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al eliminar inscripción', error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: 'Inscripción no encontrada' });
      return;
    }

    res.status(200).json({ 
      message: 'Inscripción eliminada correctamente',
      id: parseInt(id)
    });
  });
};
