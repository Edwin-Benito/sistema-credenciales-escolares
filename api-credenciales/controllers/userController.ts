import { Request, Response } from 'express';
import db from '../db/database';
import bcrypt from 'bcryptjs';

// 1. Obtener todos los usuarios (sin exponer password_hash)
export const getAllUsers = (req: Request, res: Response): void => {
  const sql = 'SELECT id, username, rol, estatus FROM Usuarios';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Error al leer usuarios', error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
};

// 2. Crear un nuevo usuario
export const createUser = (req: Request, res: Response): void => {
  const { username, password, rol } = req.body as { username?: string; password?: string; rol?: string };

  if (!username || !password || !rol) {
    res.status(400).json({ message: 'Username, password y rol son requeridos' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);

  const sql = 'INSERT INTO Usuarios (username, password_hash, rol) VALUES (?, ?, ?)';
  db.run(sql, [username, password_hash, rol], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ message: 'El nombre de usuario ya existe' });
        return;
      }
      res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, username, rol, estatus: 'activo' });
  });
};

// 3. Cambiar estatus de usuario (activo/inactivo)
export const setUserStatus = (req: Request, res: Response): void => {
  const { id } = req.params as { id: string };
  const { estatus } = req.body as { estatus?: 'activo' | 'inactivo' };

  if (!estatus || (estatus !== 'activo' && estatus !== 'inactivo')) {
    res.status(400).json({ message: "El estatus debe ser 'activo' o 'inactivo'" });
    return;
  }

  const sql = 'UPDATE Usuarios SET estatus = ? WHERE id = ?';
  db.run(sql, [estatus, id], function (err) {
    if (err) {
      res.status(500).json({ message: 'Error al actualizar estatus', error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({ message: `Usuario ${estatus} correctamente` });
  });
};
