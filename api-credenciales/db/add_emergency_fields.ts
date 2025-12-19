import db from './database';

console.log('Agregando campos de emergencia a tabla Alumnos...');

db.serialize(() => {
  // Verificar si las columnas ya existen antes de agregarlas
  db.all("PRAGMA table_info(Alumnos)", [], (err, columns: any[]) => {
    if (err) {
      console.error('Error al verificar tabla:', err.message);
      db.close();
      return;
    }

    const existingColumns = columns.map(col => col.name);

    // Agregar columnas solo si no existen
    const columnsToAdd = [
      { name: 'tutor', sql: 'ALTER TABLE Alumnos ADD COLUMN tutor TEXT' },
      { name: 'telefono1', sql: 'ALTER TABLE Alumnos ADD COLUMN telefono1 TEXT' },
      { name: 'telefono2', sql: 'ALTER TABLE Alumnos ADD COLUMN telefono2 TEXT' },
      { name: 'tipo_sangre', sql: 'ALTER TABLE Alumnos ADD COLUMN tipo_sangre TEXT' },
      { name: 'domicilio', sql: 'ALTER TABLE Alumnos ADD COLUMN domicilio TEXT' }
    ];

    let completed = 0;
    const total = columnsToAdd.filter(col => !existingColumns.includes(col.name)).length;

    if (total === 0) {
      console.log('✅ Todas las columnas ya existen. No se requieren cambios.');
      db.close();
      return;
    }

    columnsToAdd.forEach(col => {
      if (!existingColumns.includes(col.name)) {
        db.run(col.sql, (err) => {
          if (err) {
            console.error(`Error al agregar columna ${col.name}:`, err.message);
          } else {
            console.log(`✅ Columna ${col.name} agregada correctamente`);
          }
          
          completed++;
          if (completed === total) {
            console.log('\n🎉 ¡Migración completada! Campos de emergencia agregados.');
            db.close();
          }
        });
      }
    });
  });
});
