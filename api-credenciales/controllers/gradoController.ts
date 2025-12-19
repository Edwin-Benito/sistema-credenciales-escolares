import { Request, Response } from 'express';
import db from '../db/database';

export const getAllGrados = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM Grados ORDER BY id';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer grados', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

export const createGrado = (req: Request, res: Response): void => {
  const { nombre } = req.body as { nombre?: string };

  if (!nombre) {
    res.status(400).json({ message: "El 'nombre' es requerido" });
    return;
  }

  const sql = 'INSERT INTO Grados (nombre) VALUES (?)';
  db.run(sql, [nombre], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al crear grado', error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, nombre });
  });
};

export const deleteGrado = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };

  const sql = 'DELETE FROM Grados WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al eliminar grado', error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Grado no encontrado' });
      return;
    }
    res.status(200).json({ message: 'Grado eliminado correctamente' });
  });
};
