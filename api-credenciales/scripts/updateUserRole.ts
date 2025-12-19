import db from '../db/database';

const userId = process.argv[2];
const newRole = process.argv[3];

if (!userId || !newRole) {
  console.error('Uso: npm run update-role <userId> <rol>');
  console.error('Ejemplo: npm run update-role 1 Administrador');
  process.exit(1);
}

const sql = 'UPDATE Usuarios SET rol = ? WHERE id = ?';

db.run(sql, [newRole, userId], function(err) {
  if (err) {
    console.error('❌ Error al actualizar rol:', err.message);
    process.exit(1);
  }
  
  if (this.changes === 0) {
    console.log('⚠️  No se encontró el usuario con ID:', userId);
  } else {
    console.log(`✅ Rol actualizado exitosamente para usuario ${userId} → "${newRole}"`);
  }
  
  db.close();
});
