import db from './database';

const sql = "ALTER TABLE Usuarios ADD COLUMN estatus TEXT NOT NULL DEFAULT 'activo'";

db.run(sql, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name') || err.message.includes('duplicate column')) {
      console.log('La columna "estatus" ya existe.');
    } else {
      console.error('Error al agregar columna "estatus":', err.message);
    }
  } else {
    console.log('¡Tabla "Usuarios" actualizada con la columna "estatus"!');
  }
  db.close();
});
