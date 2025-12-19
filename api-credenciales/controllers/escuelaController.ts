import { Request, Response } from 'express';
import db from '../db/database';

export const getEscuelaInfo = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM EscuelaInfo WHERE id = 1';
  db.get(sql, [], (err, row) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer info de la escuela', error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Información de la escuela no encontrada' });
      return;
    }
    res.status(200).json(row);
  });
};

export const updateEscuelaInfo = (req: Request, res: Response): void => {
  const { nombre_escuela, cct, direccion, telefono, datos_contacto_reverso } = req.body as {
    nombre_escuela?: string;
    cct?: string;
    direccion?: string;
    telefono?: string;
    datos_contacto_reverso?: string;
  };

  if (!nombre_escuela || !cct) {
    res.status(400).json({ message: 'Nombre de la escuela y CCT son requeridos' });
    return;
  }

  const sql = `UPDATE EscuelaInfo 
               SET nombre_escuela = ?, cct = ?, direccion = ?, telefono = ?, datos_contacto_reverso = ? 
               WHERE id = 1`;
  const params = [nombre_escuela, cct, direccion, telefono, datos_contacto_reverso];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al actualizar la info', error: err.message });
      return;
    }
    res.status(200).json({ message: 'Información de la escuela actualizada' });
  });
};
