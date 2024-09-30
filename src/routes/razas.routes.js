import { Router } from "express";
import { listarRazas, registrarRaza, actualizarRaza, eliminarRaza, buscarRaza } from "../controllers/razas.controller.js";
import { validarToken } from "../controllers/validacion.controller.js";
import { validateActualizarRaza, validateCrearRaza } from "../validation/razas.validation.js";

const RazasRoutes = Router();

RazasRoutes.get("/listar", validarToken, listarRazas);
RazasRoutes.post("/registrar", validarToken, validateCrearRaza, registrarRaza);
RazasRoutes.put("/actualizar/:id_raza", validarToken, validateActualizarRaza, actualizarRaza);
RazasRoutes.delete("/eliminar/:id_raza", validarToken, eliminarRaza);
RazasRoutes.get("/buscar/:id_raza", validarToken, buscarRaza);

export default RazasRoutes;