import { Response } from 'express';
import db from '../db/database';
import ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import { AuthRequest } from '../middleware/authMiddleware';

interface ExcelRow {
  [key: string]: any;
  'GRADO Y GRUPO': string;
  'ALUMNO': string;
  'TUTOR_PADRE'?: string;
  'TELEFONO 1': string;
  'TELEFONO 2'?: string;
  'TIPO DE SANGRE'?: string;
  'DIRECCION'?: string;
}

export const importAlumnos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      console.log('No se recibió archivo');
      res.status(400).json({ message: 'No se subió ningún archivo Excel' });
      return;
    }
    
    console.log('Archivo recibido:', req.file.originalname, 'Tamaño:', req.file.size);
    
    const ciclo_escolar_id = req.body.ciclo_escolar_id ? parseInt(req.body.ciclo_escolar_id) : undefined;
    const grupo_id = req.body.grupo_id ? parseInt(req.body.grupo_id) : undefined;
    const modo_importacion = (req.body.modo_importacion as 'masiva' | 'individual') || 'masiva'; // Default a masiva
    
    console.log('Import params:', { ciclo_escolar_id, grupo_id, modo_importacion });
    
    if (!ciclo_escolar_id) {
      res.status(400).json({ message: 'Se requiere el ciclo_escolar_id' });
      return;
    }
    
    // En modo individual, se requiere grupo_id
    if (modo_importacion === 'individual' && !grupo_id) {
      res.status(400).json({ message: 'En modo individual se requiere seleccionar un grupo' });
      return;
    }
    // Validación mínima de tipo de archivo (ZIP OOXML: encabezado PK) para mitigar entrada maliciosa
    const buf = req.file.buffer;
    if (buf.length < 4 || buf[0] !== 0x50 || buf[1] !== 0x4b) {
      res.status(400).json({ message: 'El archivo no parece un .xlsx válido' });
      return;
    }

    // Cargar con exceljs (elimina dependencias vulnerables)
    const workbook = new ExcelJS.Workbook();
    const bin: NodeBuffer = NodeBuffer.from(buf);
    await workbook.xlsx.load(bin as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      res.status(400).json({ message: 'El archivo Excel no contiene hojas' });
      return;
    }

    // Mapear encabezados esperados -> índice de columna
    const headerRow = worksheet.getRow(1);
    const headerMap = new Map<string, number>();
    
    for (let i = 1; i <= headerRow.cellCount; i++) {
      const key = headerRow.getCell(i).text.trim().replace(/\s+/g, ' ');
      console.log(`Columna ${i}: "${key}"`);
      if (key) {
        headerMap.set(key, i);
      }
    }
    
    console.log('Headers encontrados:', Array.from(headerMap.keys()));
    
    // Validar columnas obligatorias
    const requiredHeaders = ['GRADO Y GRUPO', 'NOMBRE COMPLETO'];
    for (const h of requiredHeaders) {
      if (!headerMap.has(h)) {
        res.status(400).json({ 
          message: `Falta la columna obligatoria "${h}". Columnas encontradas: ${Array.from(headerMap.keys()).join(', ')}` 
        });
        return;
      }
    }

    const alumnosFromExcel: ExcelRow[] = [];
    const maxRows = Math.min(worksheet.rowCount, 2000); // límite de seguridad
    for (let r = 2; r <= maxRows; r++) {
      const row = worksheet.getRow(r);
      if (row && row.hasValues) {
        const safe = Object.create(null) as ExcelRow;
        const getText = (h: string) => {
          const idx = headerMap.get(h);
          return idx ? row.getCell(idx).text.toString().trim() : '';
        };
        
        safe['GRADO Y GRUPO'] = getText('GRADO Y GRUPO');
        safe['ALUMNO'] = getText('NOMBRE COMPLETO');
        safe['TUTOR_PADRE'] = getText('TUTOR');
        safe['TELEFONO 1'] = getText('TELEFONO 1');
        safe['TELEFONO 2'] = getText('TELEFONO 2');
        safe['TIPO DE SANGRE'] = getText('TIPO DE SANGRE');
        safe['DIRECCION'] = getText('DIRECION');
        alumnosFromExcel.push(safe);
      }
    }

    if (alumnosFromExcel.length === 0) {
      res.status(400).json({ message: 'El archivo Excel está vacío' });
      return;
    }

    db.serialize(() => {
      db.run('BEGIN IMMEDIATE TRANSACTION');
      const findAlumnoSql = 'SELECT id FROM Alumnos WHERE nombres = ? AND apellido_paterno = ? AND (apellido_materno = ? OR (apellido_materno IS NULL AND ? IS NULL))';
      const updateAlumnoSql = 'UPDATE Alumnos SET tutor = ?, telefono1 = ?, telefono2 = ?, tipo_sangre = ?, domicilio = ? WHERE id = ?';
      const insertAlumnoSql = 'INSERT INTO Alumnos (nombres, apellido_paterno, apellido_materno, curp, matricula, fecha_nacimiento, tutor, telefono1, telefono2, tipo_sangre, domicilio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const findInscripcionSql = 'SELECT id FROM Inscripciones WHERE alumno_id = ? AND ciclo_escolar_id = ?';
      const updateInscripcionSql = 'UPDATE Inscripciones SET grupo_id = ? WHERE id = ?';
      const insertInscripcionSql = 'INSERT INTO Inscripciones (alumno_id, grupo_id, ciclo_escolar_id) VALUES (?, ?, ?)';
      const findGrupoSql = 'SELECT g.id FROM Grupos g JOIN Grados gr ON gr.id = g.grado_id WHERE gr.nombre = ? AND g.letra = ?';

      let index = 0;
      const total = alumnosFromExcel.length;
      let alumnosCreados = 0;
      let alumnosActualizados = 0;

      const rollback = (msg: string, error?: unknown) => {
        db.run('ROLLBACK');
        res.status(500).json({ message: msg, error: (error as any)?.message });
      };

      const processNext = () => {
        if (index >= total) {
          db.run('COMMIT', (err) => {
            if (err) {
              rollback('Error al confirmar transacción', err);
              return;
            }
            res.status(200).json({ 
              message: `Importación completada con éxito. ${total} alumnos procesados (${alumnosCreados} creados, ${alumnosActualizados} actualizados).` 
            });
          });
          return;
        }

        const row = alumnosFromExcel[index];
        const nombreCompleto = row['ALUMNO']?.toString().trim();
        const gradoYGrupo = row['GRADO Y GRUPO']?.toString().trim();
        
        console.log(`Fila ${index + 2}: ALUMNO="${nombreCompleto}", GRADO Y GRUPO="${gradoYGrupo}"`);
        
        if (!nombreCompleto) {
          rollback(`Error en la fila ${index + 2}: Falta el nombre del alumno.`);
          return;
        }

        // Parsear nombre completo: "APELLIDO_PATERNO APELLIDO_MATERNO NOMBRE(S)"
        const partesNombre = nombreCompleto.split(' ').filter(p => p.length > 0);
        if (partesNombre.length < 2) {
          rollback(`Error en la fila ${index + 2}: El nombre debe contener al menos apellido y nombre.`);
          return;
        }

        // Formato estándar: APELLIDO_PATERNO APELLIDO_MATERNO NOMBRE(S)
        // Si tiene 2 palabras: APELLIDO_PATERNO NOMBRE
        // Si tiene 3+ palabras: APELLIDO_PATERNO APELLIDO_MATERNO NOMBRE(S)
        let ap_paterno: string;
        let ap_materno: string | null;
        let nombres: string;

        if (partesNombre.length === 2) {
          // Solo apellido paterno y nombre
          ap_paterno = partesNombre[0];
          ap_materno = null;
          nombres = partesNombre[1];
        } else {
          // Apellido paterno, apellido materno, y nombre(s)
          ap_paterno = partesNombre[0];
          ap_materno = partesNombre[1];
          nombres = partesNombre.slice(2).join(' ');
        }
        
        // Generar un CURP temporal único basado en el nombre (solo para alumnos nuevos)
        const curp = `${nombres.substring(0,2)}${ap_paterno.substring(0,2)}${Date.now()}${index}`.substring(0, 18).toUpperCase();
        const matricula = null;
        const fecha_nacimiento = null;
        
        // Datos de emergencia del Excel
        const tutor = row['TUTOR_PADRE']?.toString().trim() || null;
        const telefono1 = row['TELEFONO 1']?.toString().trim() || null;
        const telefono2 = row['TELEFONO 2']?.toString().trim() || null;
        const tipo_sangre = row['TIPO DE SANGRE']?.toString().trim() || null;
        const domicilio = row['DIRECCION']?.toString().trim() || null;

        // Determinar el grupo_id según el modo de importación
        const determinarGrupoId = (callback: (grupoId: number) => void) => {
          if (modo_importacion === 'individual') {
            // Modo individual: usar el grupo seleccionado
            callback(grupo_id!);
          } else {
            // Modo masivo: parsear "GRADO Y GRUPO" del Excel
            if (!gradoYGrupo || gradoYGrupo.length === 0) {
              rollback(`Error en la fila ${index + 2}: Falta GRADO Y GRUPO en modo masivo. Valor encontrado: "${row['GRADO Y GRUPO']}"`);
              return;
            }
            
            // Parsear "1° A" -> grado="1°", letra="A"
            const match = gradoYGrupo.match(/^(\d+)°?\s*([A-Z])$/i);
            if (!match) {
              rollback(`Error en la fila ${index + 2}: Formato inválido en GRADO Y GRUPO "${gradoYGrupo}". Esperado: "1° A"`);
              return;
            }
            
            const gradoNumero = match[1] + '°';
            const letraGrupo = match[2].toUpperCase();
            
            // Buscar el grupo en la base de datos
            db.get(findGrupoSql, [gradoNumero, letraGrupo], (err, grupo: { id: number } | undefined) => {
              if (err) {
                rollback(`Error buscando grupo "${gradoYGrupo}"`, err);
                return;
              }
              if (!grupo) {
                rollback(`Error en la fila ${index + 2}: No existe el grupo "${gradoYGrupo}". Crea primero el grado "${gradoNumero}" y el grupo "${letraGrupo}".`);
                return;
              }
              callback(grupo.id);
            });
          }
        };

        determinarGrupoId((grupoIdFinal) => {
          // Buscar alumno por nombre completo (nombres + apellidos)
          db.get(findAlumnoSql, [nombres, ap_paterno, ap_materno, ap_materno], (err, alumno: { id: number } | undefined) => {
            if (err) {
              rollback('Error buscando alumno', err);
              return;
            }

            const onAlumnoProcessed = (alumno_id: number) => {
              // Verificar si ya existe inscripción para este alumno en este ciclo
              db.get(findInscripcionSql, [alumno_id, ciclo_escolar_id], (errInsc, inscripcion: { id: number } | undefined) => {
                if (errInsc) {
                  rollback('Error buscando inscripción', errInsc);
                  return;
                }

                if (inscripcion) {
                  // Ya existe inscripción, actualizar el grupo
                  db.run(updateInscripcionSql, [grupoIdFinal, inscripcion.id], (err2) => {
                    if (err2) {
                      rollback('Error actualizando inscripción', err2);
                      return;
                    }
                    index++;
                    processNext();
                  });
                } else {
                  // No existe inscripción, crear nueva
                  db.run(insertInscripcionSql, [alumno_id, grupoIdFinal, ciclo_escolar_id], (err2) => {
                    if (err2) {
                      rollback('Error insertando inscripción', err2);
                      return;
                    }
                    index++;
                    processNext();
                  });
                }
              });
            };

            if (alumno) {
              // Alumno existe, actualizar datos de emergencia
              alumnosActualizados++;
              db.run(updateAlumnoSql, [tutor, telefono1, telefono2, tipo_sangre, domicilio, alumno.id], (err3) => {
                if (err3) {
                  rollback('Error actualizando alumno', err3);
                  return;
                }
                onAlumnoProcessed(alumno.id);
              });
            } else {
              // Alumno no existe, crear nuevo con datos de emergencia
              alumnosCreados++;
              db.run(insertAlumnoSql, [nombres, ap_paterno, ap_materno, curp, matricula, fecha_nacimiento, tutor, telefono1, telefono2, tipo_sangre, domicilio], function (err4) {
                if (err4) {
                  rollback('Error creando alumno', err4);
                  return;
                }
                onAlumnoProcessed(this.lastID);
              });
            }
          });
        });
      };

      processNext();
    });
  } catch (error: any) {
    console.error('Error en importación:', error);
    res.status(500).json({ message: 'Error durante la importación. No se procesó el archivo.', error: error.message });
  }
};
