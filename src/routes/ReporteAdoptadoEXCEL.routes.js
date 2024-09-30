import express from 'express';
import { generarReporteAdoptadosEXCEL } from '../controllers/ReporteAdoptadoControllerexcel.js';

const ReporteAdoptadoEXCELrouter = express.Router();

// Ruta para generar el reporte de adopciones
ReporteAdoptadoEXCELrouter.get('/reporte_excel', generarReporteAdoptadosEXCEL);

export default ReporteAdoptadoEXCELrouter;
