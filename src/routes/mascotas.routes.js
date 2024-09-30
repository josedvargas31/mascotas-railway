import { Router } from "express";
import { listarMascotas, registrarMascota, actualizarMascota, eliminarMascota, buscarMascota, obtenerConteoPorEstado, generarFichaTecnica /* iniciarAdopcion, administrarAdopcion, listarMascotasConUsuarios */ } from "../controllers/mascotas.controller.js";
import upload from '../config/multer.config.js'; 
import { uploadImage } from "../config/imagenes.controller.js";
import { validarToken } from "../controllers/validacion.controller.js";
import { validateActualizarMascota, validateCrearMascota } from "../validation/mascotas.validation.js";

const MascotaRoutes = Router();

MascotaRoutes.get("/listar", listarMascotas);
MascotaRoutes.post("/registrar",  validarToken, upload.array('imagenes', 4), registrarMascota);
MascotaRoutes.get('/conteo/estado',  obtenerConteoPorEstado);
MascotaRoutes.put("/actualizar/:id_mascota", validarToken, validateActualizarMascota,  upload.array('imagenes', 4), actualizarMascota);
MascotaRoutes.delete("/eliminar/:id_mascota", validarToken, eliminarMascota);
MascotaRoutes.get("/buscar/:id_mascota", validarToken, buscarMascota);
MascotaRoutes.get('/pdf/:id', generarFichaTecnica);
/*  */


export default MascotaRoutes;