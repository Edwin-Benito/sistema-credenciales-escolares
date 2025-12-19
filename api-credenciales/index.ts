import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import './db/database';
import authRoutes from './routes/auth';
import cicloRoutes from './routes/ciclos';
import userRoutes from './routes/users';
import gradoRoutes from './routes/grados';
import grupoRoutes from './routes/grupos';
import escuelaRoutes from './routes/escuela';
import alumnoRoutes from './routes/alumnos';
import inscripcionRoutes from './routes/inscripciones';
import importRoutes from './routes/import';
import credencialRoutes from './routes/credenciales';
import backupRoutes from './routes/backup';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de uploads
app.use('/', express.static(path.join(__dirname, 'uploads')));
// Servir assets (plantillas e imágenes)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req: Request, res: Response) => {
  res.send('¡API de Credenciales funcionando!');
});

app.use('/api', authRoutes);
app.use('/api/ciclos-escolares', cicloRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/escuela-info', escuelaRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/importar-excel', importRoutes);
app.use('/api/credenciales', credencialRoutes);
app.use('/api/backup', backupRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
