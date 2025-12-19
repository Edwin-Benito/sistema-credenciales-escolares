import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function crearPlantillaExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Alumnos');

  // Definir las columnas
  worksheet.columns = [
    { header: 'Nombre(s)', key: 'nombres', width: 20 },
    { header: 'Apellido Paterno', key: 'apellido_paterno', width: 20 },
    { header: 'Apellido Materno', key: 'apellido_materno', width: 20 },
    { header: 'CURP', key: 'curp', width: 20 },
    { header: 'Matricula', key: 'matricula', width: 15 }
  ];

  // Dar formato al encabezado
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2196F3' }
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Agregar datos de ejemplo
  const datosEjemplo = [
    {
      nombres: 'Juan Carlos',
      apellido_paterno: 'Pérez',
      apellido_materno: 'López',
      curp: 'PELJ801023HDFRRR01',
      matricula: '2024001'
    },
    {
      nombres: 'María Fernanda',
      apellido_paterno: 'González',
      apellido_materno: 'Ruiz',
      curp: 'GORF900515MDFNZR02',
      matricula: '2024002'
    },
    {
      nombres: 'Pedro',
      apellido_paterno: 'Martínez',
      apellido_materno: 'Sánchez',
      curp: 'MASP850220HDFRTD03',
      matricula: '2024003'
    },
    {
      nombres: 'Ana Laura',
      apellido_paterno: 'Hernández',
      apellido_materno: 'García',
      curp: 'HEGA920310MDFRRN04',
      matricula: '2024004'
    },
    {
      nombres: 'Luis Miguel',
      apellido_paterno: 'Rodríguez',
      apellido_materno: 'Flores',
      curp: 'ROFL880705HDFDRR05',
      matricula: '2024005'
    }
  ];

  datosEjemplo.forEach(alumno => {
    worksheet.addRow(alumno);
  });

  // Guardar el archivo
  const filePath = path.join(__dirname, 'plantilla-alumnos.xlsx');
  await workbook.xlsx.writeFile(filePath);

  console.log(`✅ Plantilla de Excel creada exitosamente en: ${filePath}`);
  console.log(`📊 Contiene ${datosEjemplo.length} alumnos de ejemplo`);
  console.log('\n📋 Estructura del archivo:');
  console.log('   - Nombre(s)');
  console.log('   - Apellido Paterno');
  console.log('   - Apellido Materno');
  console.log('   - CURP');
  console.log('   - Matricula');
  console.log('\n💡 Puedes usar este archivo para probar la importación masiva');
}

crearPlantillaExcel().catch(console.error);
