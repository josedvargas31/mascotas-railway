import { Router } from "express";
import { listarAdopciones, iniciarAdopcion, administrarAdopcion, listarMascotasAceptadas, listarMascotasEnProcesoAdopcion } from "../controllers/adopciones.controller.js";
import { validarToken } from "../controllers/validacion.controller.js";

const AdopcionRoutes = Router();

AdopcionRoutes.get("/listar", validarToken, listarAdopciones);
AdopcionRoutes.get("/listaraceptadas/:id_usuario", validarToken, listarMascotasAceptadas);
AdopcionRoutes.get('/proceso/:fk_id_usuario_adoptante', listarMascotasEnProcesoAdopcion);
/*  */
AdopcionRoutes.post('/iniciar/:id_mascota', iniciarAdopcion);
AdopcionRoutes.post('/administrar/:id_adopcion', administrarAdopcion);

export default AdopcionRoutes;