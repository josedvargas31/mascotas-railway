import { Router } from "express";
import { generarReporteEXCEL } from "../controllers/ReporteAdopcionControllerexcel.js";

const ReporteAdopcionEXCELrouter = Router();
ReporteAdopcionEXCELrouter.get("/reporte_excel", generarReporteEXCEL);

export default ReporteAdopcionEXCELrouter;