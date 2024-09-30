import { Router } from "express";
import { listarDepartamentos, registrarDepartamento, actualizarDepartamento, eliminarDepartamento, buscarDepartamento } from "../controllers/departamentos.cotroller.js";
import { validarToken } from "../controllers/validacion.controller.js";
import { validateActualizarDepartamento, validateCrearDepartamento } from "../validation/departamentos.validation.js";

const DepartamentoRoutes = Router();

DepartamentoRoutes.get("/listar", validarToken, listarDepartamentos);
DepartamentoRoutes.post("/registrar", validarToken, validateCrearDepartamento, registrarDepartamento);
DepartamentoRoutes.put("/actualizar/:id_departamento", validarToken, validateActualizarDepartamento, actualizarDepartamento);
DepartamentoRoutes.delete("/eliminar/:id_departamento", validarToken, eliminarDepartamento);
DepartamentoRoutes.get("/buscar/:id_departamento", validarToken, buscarDepartamento);

export default DepartamentoRoutes;