import { Router } from "express";
import { listarCategorias, registrarCategoria, actualizarCategoria, eliminarCategoria, buscarCategoria, desactivarCategoria } from "../controllers/categorias.controller.js";

const CategoriaRoutes = Router();

CategoriaRoutes.get("/listar", listarCategorias);
CategoriaRoutes.post("/registrar", registrarCategoria);
CategoriaRoutes.put("/actualizar/:id_categoria", actualizarCategoria);
CategoriaRoutes.delete("/eliminar/:id_categoria", eliminarCategoria);
CategoriaRoutes.put("/desactivar/:id_categoria", desactivarCategoria);
CategoriaRoutes.get("/buscar/:id_categoria", buscarCategoria);

export default CategoriaRoutes;