import { Request, Response } from 'express';
import db from '../db/database';

export const getAllCiclos = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM CiclosEscolares ORDER BY nombre DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer los ciclos', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

export const createCiclo = (req: Request, res: Response): void => {
  const { nombre } = req.body as { nombre?: string };
  if (!nombre) {
    res.status(400).json({ message: "El 'nombre' es requerido" });
    return;
  }
  const sql = 'INSERT INTO CiclosEscolares (nombre) VALUES (?)';
  db.run(sql, [nombre], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al crear el ciclo', error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, nombre, estatus: 'inactivo' });
  });
};

export const activarCiclo = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };

  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');

    const sqlDesactivar = "UPDATE CiclosEscolares SET estatus = 'inactivo' WHERE estatus = 'activo'";
    db.run(sqlDesactivar, (err) => {
      if (err) {
        db.run('ROLLBACK;');
        res.status(500).json({ message: 'Error al desactivar ciclos', error: err.message });
        return;
      }
      const sqlActivar = "UPDATE CiclosEscolares SET estatus = 'activo' WHERE id = ?";
      db.run(sqlActivar, [id], function (err) {
        if (err) {
          db.run('ROLLBACK;');
          res.status(500).json({ message: 'Error al activar el ciclo', error: err.message });
          return;
        }
        db.run('COMMIT;');
        if (this.changes === 0) {
          res.status(404).json({ message: 'Ciclo no encontrado' });
        } else {
          res.status(200).json({ message: 'Ciclo activado correctamente' });
        }
      });
    });
  });
};
