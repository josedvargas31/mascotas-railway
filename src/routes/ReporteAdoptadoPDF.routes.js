import express from 'express';
import { generarReporteAdoptadosPDF } from '../controllers/ReporteAdoptadoControllerpdf.js';

const ReporteAdoptadoPDFrouter = express.Router();

// Ruta para generar el reporte de adopciones
ReporteAdoptadoPDFrouter.get('/reporte_pdf', generarReporteAdoptadosPDF);

export default ReporteAdoptadoPDFrouter;
