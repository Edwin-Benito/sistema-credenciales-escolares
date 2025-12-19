import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fotos/');
  },
  filename: (req, file, cb) => {
    const inscripcionId = (req.params as { id?: string }).id || 'sin-id';
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `foto-${inscripcionId}-${uniqueSuffix}`);
  }
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  return cb(new Error('Error: ¡Solo se permiten imágenes (jpeg, jpg, png, gif)!'));
};

export const uploadFoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
