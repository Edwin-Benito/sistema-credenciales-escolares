import { Request, Response } from 'express';
import db from '../db/database';

export const getAllGrupos = (req: Request, res: Response): void => {
  const sql = `SELECT g.id, g.letra, g.grado_id, gr.nombre as grado_nombre
               FROM Grupos g
               JOIN Grados gr ON g.grado_id = gr.id
               ORDER BY gr.id, g.letra`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer grupos', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

export const createGrupo = (req: Request, res: Response): void => {
  const { grado_id, letra } = req.body as { grado_id?: number; letra?: string };

  if (!grado_id || !letra) {
    res.status(400).json({ message: "'grado_id' y 'letra' son requeridos" });
    return;
  }

  const sql = 'INSERT INTO Grupos (grado_id, letra) VALUES (?, ?)';
  db.run(sql, [grado_id, letra], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al crear grupo', error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, grado_id, letra });
  });
};

export const deleteGrupo = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };

  const sql = 'DELETE FROM Grupos WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al eliminar grupo', error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }
    res.status(200).json({ message: 'Grupo eliminado correctamente' });
  });
};
