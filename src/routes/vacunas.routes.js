import { Router } from "express";
import { listarVacunas, registrarVacuna, actualizarVacuna, eliminarVacuna, buscarVacuna, listarVacunasAsociadaAMascota } from "../controllers/vacunas.controller.js";

const vacunaRoutes = Router();

vacunaRoutes.get("/listar", listarVacunas);
vacunaRoutes.get("/listarVacunasAsociadaAMascota/:id_mascota", listarVacunasAsociadaAMascota);
vacunaRoutes.post("/registrar", registrarVacuna);
vacunaRoutes.put("/actualizar/:id_vacuna", actualizarVacuna);
vacunaRoutes.delete("/eliminar/:id_vacuna", eliminarVacuna);
vacunaRoutes.get("/buscar/:id_vacuna", buscarVacuna);

export default vacunaRoutes;