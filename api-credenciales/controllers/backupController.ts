import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import db from '../db/database';

export const getBackup = (req: Request, res: Response) => {
  try {
    const projectRoot = path.join(__dirname, '..', '..');
    const dbPath = path.join(projectRoot, 'database.sqlite');
    const backupPath = path.join(projectRoot, 'backup.sqlite');

    const sendOrCleanup = () => {
      res.download(backupPath, 'backup.sqlite', (err) => {
        // Limpieza opcional del archivo temporal
        fs.existsSync(backupPath) && fs.unlink(backupPath, () => {});
        if (err && !res.headersSent) {
          res.status(500).json({ message: 'Error al descargar el backup' });
        }
      });
    };

    // Si existe el archivo base y no queremos usar VACUUM, aún podemos enviarlo directamente
    // pero preferimos generar un respaldo consistente con VACUUM INTO.

    // Intentar VACUUM INTO para generar una copia consistente, incluso en modo WAL
    const vacuumSql = `VACUUM INTO '${backupPath.replace(/'/g, "''")}'`;
    db.run(vacuumSql, (err) => {
      if (err) {
        // Fallback: si VACUUM INTO no está soportado, intentar enviar el archivo base si existe
        if (fs.existsSync(dbPath)) {
          res.download(dbPath, 'backup.sqlite', (err2) => {
            if (err2 && !res.headersSent) {
              res.status(500).json({ message: 'Error al descargar el backup' });
            }
          });
        } else {
          res.status(404).json({ message: 'Backup no encontrado' });
        }
        return;
      }
      sendOrCleanup();
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al generar backup' });
  }
};
