import { Request, Response } from 'express';
import db from '../db/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi-clave-secreta-para-el-proyecto-123';

interface User {
  id: number;
  username: string;
  password_hash: string;
  rol: string;
}

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    return;
  }

  const sql = 'SELECT * FROM Usuarios WHERE username = ?';
  db.get(sql, [username], (err, user: User) => {
    if (err) {
      res.status(500).json({ message: 'Error en el servidor', error: err.message });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    const payload = { id: user.id, username: user.username, rol: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login exitoso', token, user: payload });
  });
};
