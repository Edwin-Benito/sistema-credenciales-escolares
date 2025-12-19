import db from './database';

console.log('Agregando columnas de datos de emergencia...');

db.serialize(() => {
  // Agregar columnas si no existen
  const columnas = [
    'tutor TEXT',
    'telefono1 TEXT',
    'telefono2 TEXT',
    'tipo_sangre TEXT',
    'domicilio TEXT'
  ];

  columnas.forEach(columna => {
    const [nombre] = columna.split(' ');
    db.run(`ALTER TABLE Alumnos ADD COLUMN ${columna}`, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`✓ Columna "${nombre}" ya existe`);
        } else {
          console.error(`Error al agregar columna "${nombre}":`, err.message);
        }
      } else {
        console.log(`✓ Columna "${nombre}" agregada`);
      }
    });
  });

  setTimeout(() => {
    console.log('\n¡Columnas de emergencia agregadas!');
    db.close();
  }, 1000);
});
