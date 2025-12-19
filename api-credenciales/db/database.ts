import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    // Configurar timeout para evitar database locked
    db.configure('busyTimeout', 10000); // 10 segundos
    db.exec('PRAGMA journal_mode = WAL;', (err) => {
      if (err) {
        console.error('Error al habilitar WAL:', err.message);
      } else {
        console.log('Modo WAL habilitado.');
      }
    });
  }
});

export default db;
