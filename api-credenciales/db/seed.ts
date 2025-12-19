import db from './database';
import bcrypt from 'bcryptjs';

const adminUsername = 'admin';
const adminPassword = 'QWERTY ';
const adminRol = 'administrador';

console.log('Iniciando seeder...');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(adminPassword, salt);

console.log(`Creando usuario: ${adminUsername} con rol: ${adminRol}`);

const sql = 'INSERT INTO Usuarios (username, password_hash, rol) VALUES (?, ?, ?)';

db.run(sql, [adminUsername, hash, adminRol], function (err) {
  if (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('El usuario "admin" ya existe.');
    } else {
      console.error('Error al crear usuario admin:', err.message);
    }
  } else {
    console.log(`¡Usuario admin creado con éxito! ID: ${this.lastID}`);
  }
  db.close();
});
