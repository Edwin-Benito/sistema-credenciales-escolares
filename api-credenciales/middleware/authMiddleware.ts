import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Usa la misma clave que en authController
const JWT_SECRET = 'mi-clave-secreta-para-el-proyecto-123';

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token no válido, autorización denegada' });
    }
  }

  return res.status(401).json({ message: 'No hay token, autorización denegada' });
};
