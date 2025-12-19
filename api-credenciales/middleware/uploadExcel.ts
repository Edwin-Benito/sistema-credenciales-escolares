import multer from 'multer';
import path from 'path';

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowed = /xlsx|xls/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  console.log('Archivo recibido:', file.originalname, 'Extensión:', ext);
  if (allowed.test(ext)) return cb(null, true);
  console.log('Archivo rechazado por extensión');
  return cb(new Error('Error: ¡Solo se permiten archivos .xlsx o .xls!'));
};

export const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
