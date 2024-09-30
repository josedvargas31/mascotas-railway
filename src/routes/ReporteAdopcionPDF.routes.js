import { Router } from "express";
import { generarReportePDF } from "../controllers/ReporteAdopcionControllerpdf.js";

const ReporteAdopcionPDFrouter = Router();
ReporteAdopcionPDFrouter.get("/reporte_pdf", generarReportePDF);

export default ReporteAdopcionPDFrouter;
