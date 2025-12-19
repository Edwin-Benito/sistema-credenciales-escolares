import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import db from '../db/database';

interface Zone {
  x: number; y: number; w: number; h: number;
}

interface LayoutFieldBase {
  zone?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  size?: number;
  minSize?: number;
  font?: 'regular' | 'bold';
  color?: string;
  autoFit?: boolean;
  type?: 'text' | 'image';
}

interface LayoutFieldText extends LayoutFieldBase {
  x?: number; y?: number; width?: number;
}

interface LayoutFieldImage {
  zone?: string;
  type?: 'image';
  x?: number; y?: number; w?: number; h?: number;
}

interface LayoutConfig {
  anverso: {
    image: string;
    width: number | null;
    height: number | null;
    zones?: Record<string, Zone>;
    fields: {
      foto?: LayoutFieldImage;
      nombreCompleto?: LayoutFieldText;
      curp?: LayoutFieldText;
      gradoGrupo?: LayoutFieldText;
      cicloEscolar?: LayoutFieldText;
      escuelaNombre?: LayoutFieldText;
      escuelaCct?: LayoutFieldText;
      qrCode?: LayoutFieldImage;
    };
  };
  reverso?: {
    image: string;
    width: number | null;
    height: number | null;
    zones?: Record<string, Zone>;
    fields: Record<string, LayoutFieldText>;
  };
}

const readLayout = (): LayoutConfig => {
  const layoutPath = path.join(process.cwd(), 'assets', 'template-layout.json');
  const raw = fs.readFileSync(layoutPath, 'utf-8');
  return JSON.parse(raw);
};

const mm = (doc: PDFKit.PDFDocument, rel: number, axis: 'x'|'y'): number => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  return axis === 'x' ? rel * pageWidth : rel * pageHeight;
};

const registerFonts = (doc: PDFKit.PDFDocument) => {
  const fontsDir = path.join(process.cwd(), 'assets', 'fonts');
  const regular = path.join(fontsDir, 'PublicSans-Regular.ttf');
  const bold = path.join(fontsDir, 'PublicSans-Bold.ttf');
  if (fs.existsSync(regular)) doc.registerFont('regular', regular);
  if (fs.existsSync(bold)) doc.registerFont('bold', bold);
};

// Nueva función: Dibuja texto en zona con auto-ajuste
const drawTextInZone = (
  doc: PDFKit.PDFDocument,
  text: string,
  field: LayoutFieldText,
  zone: Zone,
  baseWidth: number,
  baseHeight: number,
  offsetX: number,
  offsetY: number
) => {
  if (!text) return;
  
  const font = field.font || 'regular';
  let size = field.size || 12;
  const minSize = field.minSize || Math.floor(size * 0.7);
  const color = field.color || '#000000';
  const align = field.align || 'left';
  const valign = field.valign || 'top';
  const autoFit = field.autoFit !== false;

  // Calcular dimensiones de la zona en puntos
  const zoneX = offsetX + (zone.x * baseWidth);
  const zoneY = offsetY + (zone.y * baseHeight);
  const zoneWidth = zone.w * baseWidth;
  const zoneHeight = zone.h * baseHeight;

  doc.font(font).fillColor(color);

  // Auto-ajustar tamaño si el texto no cabe
  if (autoFit) {
    doc.fontSize(size);
    
    // Medir texto tal como PDFKit lo renderizará (con lineBreak)
    const lines = text.split('\n');
    
    // Función para calcular cuántas líneas ocupará el texto con el ancho dado
    const calculateRenderedLines = (testSize: number): number => {
      doc.fontSize(testSize);
      let totalLines = 0;
      for (const line of lines) {
        const words = line.split(' ');
        let currentLineWidth = 0;
        let linesInParagraph = 1;
        
        for (const word of words) {
          const wordWidth = doc.widthOfString(word + ' ');
          if (currentLineWidth + wordWidth > zoneWidth) {
            linesInParagraph++;
            currentLineWidth = wordWidth;
          } else {
            currentLineWidth += wordWidth;
          }
        }
        totalLines += linesInParagraph;
      }
      return totalLines;
    };

    let renderedLines = calculateRenderedLines(size);
    let currentHeight = doc.currentLineHeight() * renderedLines;

    while (currentHeight > zoneHeight && size > minSize) {
      size -= 0.5;
      renderedLines = calculateRenderedLines(size);
      doc.fontSize(size);
      currentHeight = doc.currentLineHeight() * renderedLines;
    }
  } else {
    doc.fontSize(size);
  }

  // Calcular offset vertical según valign
  let finalY = zoneY;
  const lines = text.split('\n');
  const textHeight = doc.currentLineHeight() * lines.length;
  
  if (valign === 'middle') {
    finalY = zoneY + (zoneHeight - textHeight) / 2;
  } else if (valign === 'bottom') {
    finalY = zoneY + zoneHeight - textHeight;
  }

  // Dibujar texto con alineación horizontal
  doc.text(text, zoneX, finalY, {
    width: zoneWidth,
    align: align,
    lineBreak: true,
    ellipsis: true
  });
};

const drawText = (doc: PDFKit.PDFDocument, text: string, field: LayoutFieldText) => {
  // Solo funciona con coordenadas explícitas (sistema legacy)
  if (field.x === undefined || field.y === undefined) return;
  
  const font = field.font || 'regular';
  const size = field.size || 12;
  const color = field.color || '#000000';
  doc.font(font).fontSize(size).fillColor(color);
  const x = mm(doc, field.x, 'x');
  const y = mm(doc, field.y, 'y');
  if (field.width) {
    const width = mm(doc, field.width, 'x');
    doc.text(text, x, y, { width, align: 'center' });
  } else {
    doc.text(text, x, y, { align: 'center' });
  }
};

const drawImage = (doc: PDFKit.PDFDocument, imgPath: string, field: LayoutFieldImage) => {
  // Solo funciona con coordenadas explícitas (sistema legacy)
  if (field.x === undefined || field.y === undefined || field.w === undefined || field.h === undefined) return;
  
  const x = mm(doc, field.x, 'x');
  const y = mm(doc, field.y, 'y');
  const w = mm(doc, field.w, 'x');
  const h = mm(doc, field.h, 'y');
  doc.image(imgPath, x, y, { width: w, height: h });
};

export const generarPDF = async (req: Request, res: Response) => {
  try {
    const { alumno_id, grupo_id, ciclo_id } = req.query as { alumno_id?: string; grupo_id?: string; ciclo_id?: string };
    
    // Si viene grupo_id, generar PDF para todos los alumnos del grupo
    if (grupo_id) {
      await generarPDFPorGrupo(req, res);
      return;
    }

    if (!alumno_id) {
      res.status(400).json({ message: 'alumno_id o grupo_id es requerido' });
      return;
    }

    const alumno = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT a.*, i.path_foto, g.letra AS grupo, gr.nombre AS grado, c.nombre AS ciclo
         FROM Alumnos a
         LEFT JOIN Inscripciones i ON i.alumno_id = a.id
         LEFT JOIN CiclosEscolares c ON c.id = i.ciclo_escolar_id AND c.estatus = 'activo'
         LEFT JOIN Grupos g ON g.id = i.grupo_id
         LEFT JOIN Grados gr ON gr.id = g.grado_id
         WHERE a.id = ?
         ORDER BY c.nombre DESC
         LIMIT 1
        `,
        [alumno_id],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!alumno) {
      res.status(404).json({ message: 'Alumno no encontrado' });
      return;
    }

    const escuela = await new Promise<any>((resolve, reject) => {
      db.get(`SELECT * FROM EscuelaInfo WHERE id = 1`, [], (err, row) => (err ? reject(err) : resolve(row)));
    });

    const layout = readLayout();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=credencial-${alumno.id}.pdf`);

    const doc = new PDFDocument({ size: [297.64, 420.94], margin: 0 });
    registerFonts(doc);
    doc.pipe(res);

    // Fondo anverso
    const anversoPath = path.join(process.cwd(), layout.anverso.image);
    if (fs.existsSync(anversoPath)) {
      doc.image(anversoPath, 0, 0, { width: doc.page.width, height: doc.page.height });
    }

    // Datos
    const apellidos = [alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(' ');
    const nombres = alumno.nombres;
    const nombreCompleto = `${apellidos}\n${nombres}`;
    const gradoGrupo = [alumno.grado, alumno.grupo].filter(Boolean).join(' - ');

    const zones = layout.anverso.zones || {};
    const fields = layout.anverso.fields;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Renderizar campos usando zonas
    if (fields.escuelaNombre && escuela?.nombre_escuela && zones.header) {
      drawTextInZone(doc, escuela.nombre_escuela, fields.escuelaNombre, zones.header, pageWidth, pageHeight, 0, 0);
    }
    
    if (fields.escuelaCct && escuela?.cct && zones.header) {
      drawTextInZone(doc, escuela.cct, fields.escuelaCct, zones.header, pageWidth, pageHeight, 0, 0);
    }
    
    if (fields.nombreCompleto && zones.nombre) {
      drawTextInZone(doc, nombreCompleto, fields.nombreCompleto, zones.nombre, pageWidth, pageHeight, 0, 0);
    }
    
    if (fields.curp && alumno.curp && zones.curp) {
      drawTextInZone(doc, alumno.curp, fields.curp, zones.curp, pageWidth, pageHeight, 0, 0);
    }
    
    if (fields.gradoGrupo && gradoGrupo && zones.grado) {
      drawTextInZone(doc, gradoGrupo, fields.gradoGrupo, zones.grado, pageWidth, pageHeight, 0, 0);
    }
    
    if (fields.cicloEscolar && alumno.ciclo && zones.ciclo) {
      drawTextInZone(doc, alumno.ciclo, fields.cicloEscolar, zones.ciclo, pageWidth, pageHeight, 0, 0);
    }

    // Foto
    if (fields.foto && alumno.path_foto && zones.foto) {
      const fotoPath = path.join(process.cwd(), 'uploads', alumno.path_foto);
      if (fs.existsSync(fotoPath)) {
        const fotoZone = zones.foto;
        const fotoX = fotoZone.x * pageWidth;
        const fotoY = fotoZone.y * pageHeight;
        const fotoW = fotoZone.w * pageWidth;
        const fotoH = fotoZone.h * pageHeight;
        doc.image(fotoPath, fotoX, fotoY, { width: fotoW, height: fotoH, fit: [fotoW, fotoH], align: 'center', valign: 'center' });
      }
    }

    // Reverso opcional
    if (layout.reverso) {
      doc.addPage({ size: [297.64, 420.94], margin: 0 });

      const reversoPath = path.join(process.cwd(), layout.reverso.image);
      if (fs.existsSync(reversoPath)) {
        doc.image(reversoPath, 0, 0, { width: doc.page.width, height: doc.page.height });
      }

      const reversoZones = layout.reverso.zones || {};
      const reversoFields = layout.reverso.fields || {};
      const reversoPageWidth = doc.page.width;
      const reversoPageHeight = doc.page.height;
      
      const data: Record<string, any> = {
        tutor: alumno.tutor || '',
        telefono1: alumno.telefono1 || '',
        telefono2: alumno.telefono2 || '',
        tipoSangre: alumno.tipo_sangre || '',
        domicilio: alumno.domicilio || '',
      };

      Object.entries(reversoFields).forEach(([key, fieldCfg]) => {
        const value = data[key] ?? '';
        const zone = reversoZones[key];
        if (zone && value) {
          drawTextInZone(doc, String(value), fieldCfg, zone, reversoPageWidth, reversoPageHeight, 0, 0);
        }
      });
    }

    doc.end();
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error generando PDF', error: err.message });
  }
};

// Alias en inglés para seguir la convención solicitada
export const generatePdf = generarPDF;

// Función auxiliar para agregar credencial en posición específica de la hoja
const agregarCredencialEnHoja = async (
  doc: PDFKit.PDFDocument, 
  alumno: any, 
  escuela: any, 
  layout: LayoutConfig,
  x: number,
  y: number,
  ancho: number,
  alto: number
) => {
  doc.save();
  
  // Fondo anverso escalado y posicionado
  const anversoPath = path.join(process.cwd(), layout.anverso.image);
  if (fs.existsSync(anversoPath)) {
    doc.image(anversoPath, x, y, { width: ancho, height: alto });
  }

  // Datos del alumno
  const apellidos = [alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(' ');
  const nombres = alumno.nombres;
  const nombreCompleto = `${apellidos}\n${nombres}`;
  const gradoGrupo = [alumno.grado, alumno.grupo].filter(Boolean).join(' - ');

  const zones = layout.anverso.zones || {};
  const fields = layout.anverso.fields;

  // Renderizar campos usando zonas
  if (fields.escuelaNombre && escuela?.nombre_escuela && zones.header) {
    drawTextInZone(doc, escuela.nombre_escuela, fields.escuelaNombre, zones.header, ancho, alto, x, y);
  }
  
  if (fields.escuelaCct && escuela?.cct && zones.header) {
    drawTextInZone(doc, escuela.cct, fields.escuelaCct, zones.header, ancho, alto, x, y);
  }
  
  if (fields.nombreCompleto && zones.nombre) {
    drawTextInZone(doc, nombreCompleto, fields.nombreCompleto, zones.nombre, ancho, alto, x, y);
  }
  
  if (fields.curp && alumno.curp && zones.curp) {
    drawTextInZone(doc, alumno.curp, fields.curp, zones.curp, ancho, alto, x, y);
  }
  
  if (fields.gradoGrupo && gradoGrupo && zones.grado) {
    drawTextInZone(doc, gradoGrupo, fields.gradoGrupo, zones.grado, ancho, alto, x, y);
  }
  
  if (fields.cicloEscolar && alumno.ciclo && zones.ciclo) {
    drawTextInZone(doc, alumno.ciclo, fields.cicloEscolar, zones.ciclo, ancho, alto, x, y);
  }

  // Foto
  if (fields.foto && alumno.path_foto && zones.foto) {
    const fotoPath = path.join(process.cwd(), 'uploads', alumno.path_foto);
    if (fs.existsSync(fotoPath)) {
      const fotoZone = zones.foto;
      const fotoX = x + (fotoZone.x * ancho);
      const fotoY = y + (fotoZone.y * alto);
      const fotoW = fotoZone.w * ancho;
      const fotoH = fotoZone.h * alto;
      doc.image(fotoPath, fotoX, fotoY, { width: fotoW, height: fotoH, fit: [fotoW, fotoH], align: 'center', valign: 'center' });
    }
  }

  doc.restore();
};

// Función auxiliar para agregar reverso en posición específica de la hoja
const agregarReversoEnHoja = async (
  doc: PDFKit.PDFDocument,
  alumno: any,
  escuela: any,
  layout: LayoutConfig,
  x: number,
  y: number,
  ancho: number,
  alto: number
) => {
  if (!layout.reverso) return;

  doc.save();

  const reversoPath = path.join(process.cwd(), layout.reverso.image);
  if (fs.existsSync(reversoPath)) {
    doc.image(reversoPath, x, y, { width: ancho, height: alto });
  }

  const zones = layout.reverso.zones || {};
  const fields = layout.reverso.fields || {};
  
  const data: Record<string, any> = {
    tutor: alumno.tutor || '',
    telefono1: alumno.telefono1 || '',
    telefono2: alumno.telefono2 || '',
    tipoSangre: alumno.tipo_sangre || '',
    domicilio: alumno.domicilio || '',
  };

  Object.entries(fields).forEach(([key, fieldCfg]) => {
    const value = data[key] ?? '';
    const zone = zones[key];
    if (zone && value) {
      drawTextInZone(doc, String(value), fieldCfg, zone, ancho, alto, x, y);
    }
  });

  doc.restore();
};

// Generar PDF para todos los alumnos de un grupo
const generarPDFPorGrupo = async (req: Request, res: Response) => {
  try {
    const { grupo_id, ciclo_id } = req.query as { grupo_id: string; ciclo_id?: string };

    if (!grupo_id) {
      res.status(400).json({ message: 'grupo_id es requerido' });
      return;
    }

    // Obtener alumnos del grupo
    const alumnos = await new Promise<any[]>((resolve, reject) => {
      const query = ciclo_id 
        ? `SELECT a.*, i.path_foto, g.letra AS grupo, gr.nombre AS grado, c.nombre AS ciclo
           FROM Alumnos a
           INNER JOIN Inscripciones i ON i.alumno_id = a.id
           INNER JOIN Grupos g ON g.id = i.grupo_id
           INNER JOIN Grados gr ON gr.id = g.grado_id
           INNER JOIN CiclosEscolares c ON c.id = i.ciclo_escolar_id
           WHERE i.grupo_id = ? AND i.ciclo_escolar_id = ?
           ORDER BY a.apellido_paterno, a.apellido_materno, a.nombres`
        : `SELECT a.*, i.path_foto, g.letra AS grupo, gr.nombre AS grado, c.nombre AS ciclo
           FROM Alumnos a
           INNER JOIN Inscripciones i ON i.alumno_id = a.id
           INNER JOIN Grupos g ON g.id = i.grupo_id
           INNER JOIN Grados gr ON gr.id = g.grado_id
           INNER JOIN CiclosEscolares c ON c.id = i.ciclo_escolar_id
           WHERE i.grupo_id = ? AND c.estatus = 'activo'
           ORDER BY a.apellido_paterno, a.apellido_materno, a.nombres`;

      const params = ciclo_id ? [grupo_id, ciclo_id] : [grupo_id];

      db.all(query, params, (err, rows) => (err ? reject(err) : resolve(rows as any[])));
    });

    if (!alumnos || alumnos.length === 0) {
      res.status(404).json({ message: 'No se encontraron alumnos en este grupo' });
      return;
    }

    const escuela = await new Promise<any>((resolve, reject) => {
      db.get(`SELECT * FROM EscuelaInfo WHERE id = 1`, [], (err, row) => (err ? reject(err) : resolve(row)));
    });

    const layout = readLayout();

    const grupoInfo = alumnos[0];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=credenciales-${grupoInfo.grado}-${grupoInfo.grupo}.pdf`);

    // Tamaño oficio (Legal): 8.5" x 14" = 612pt x 1008pt
    const doc = new PDFDocument({ size: 'LEGAL', margin: 20, autoFirstPage: false });
    registerFonts(doc);
    doc.pipe(res);

    // Configuración de layout: 3 columnas x 3 filas = 9 credenciales por hoja
    const credencialesPorHoja = 9;
    const columnas = 3;
    const filas = 3;
    
    // Tamaño de cada credencial: 8.96cm × 5.68cm = 254pt × 161pt
    // Con 3×3 en Legal (612×1008): espacio de 204pt × 336pt por celda
    const margenX = 8;
    const margenY = 8;
    const anchoUtil = 612 - (2 * 20); // Quitando márgenes de página
    const altoUtil = 1008 - (2 * 20);
    const anchoCredencial = (anchoUtil - (margenX * (columnas - 1))) / columnas;
    const altoCredencial = (altoUtil - (margenY * (filas - 1))) / filas;
    
    // Procesar alumnos en lotes (chunks) para paginación intercalada (Frente, Vuelta, Frente, Vuelta...)
    for (let i = 0; i < alumnos.length; i += credencialesPorHoja) {
      const lote = alumnos.slice(i, i + credencialesPorHoja);
      
      // 1. Página de ANVERSOS (Frentes)
      doc.addPage({ size: 'LEGAL', margin: 20 });
      
      for (let j = 0; j < lote.length; j++) {
        const alumno = lote[j];
        const posEnHoja = j;
        
        const col = posEnHoja % columnas;
        const fila = Math.floor(posEnHoja / columnas);
        
        const x = 20 + (col * (anchoCredencial + margenX));
        const y = 20 + (fila * (altoCredencial + margenY));
        
        await agregarCredencialEnHoja(doc, alumno, escuela, layout, x, y, anchoCredencial, altoCredencial);
      }
      
      // 2. Página de REVERSOS (Vueltas) - Si aplica
      if (layout.reverso) {
        doc.addPage({ size: 'LEGAL', margin: 20 });
        
        for (let j = 0; j < lote.length; j++) {
          const alumno = lote[j];
          const posEnHoja = j;
          
          // Invertir columna para coincidencia en impresión doble cara
          // Columna 0 (izquierda) en frente -> Columna 1 (derecha) en reverso
          const col = (columnas - 1) - (posEnHoja % columnas);
          const fila = Math.floor(posEnHoja / columnas);
          
          const x = 20 + (col * (anchoCredencial + margenX));
          const y = 20 + (fila * (altoCredencial + margenY));
          
          await agregarReversoEnHoja(doc, alumno, escuela, layout, x, y, anchoCredencial, altoCredencial);
        }
      }
    }

    doc.end();
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error generando PDF del grupo', error: err.message });
  }
};
