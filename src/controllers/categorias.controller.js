import { pool } from "../database/conexion.js";
// import { validationResult } from "express-validator";

// Listar Categorías
export const listarCategorias = async (req, res) => {
	try {
		const [result] = await pool.query("SELECT * FROM categorias");
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Categoría
export const registrarCategoria = async (req, res) => {
	try {
		const { nombre_categoria, estado } = req.body;
		const [result] = await pool.query(
			"INSERT INTO categorias (nombre_categoria, estado) VALUES (?, ?)",
			[nombre_categoria, estado]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Categoría registrada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se registró la categoría",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Actualizar Categoría por ID
export const actualizarCategoria = async (req, res) => {
	try {
		const { id_categoria } = req.params;
		const { nombre_categoria, estado } = req.body;

		// Asegúrate de que ambos campos estén presentes
		if (!nombre_categoria || !estado) {
			return res.status(400).json({
				status: 400,
				message: "Faltan campos requeridos",
			});
		}

		// Verificar si la categoría tiene razas asociadas
		const [razas] = await pool.query(
			"SELECT COUNT(*) AS count FROM razas WHERE fk_id_categoria = ?",
			[id_categoria]
		);

		if (razas[0].count > 0) {
			return res.status(400).json({
				status: 400,
				message: "No se puede editar la categoría porque tiene razas asociadas",
			});
		}

		// Si no tiene razas asociadas, procede con la actualización
		const [result] = await pool.query(
			"UPDATE categorias SET nombre_categoria = ?, estado = ? WHERE id_categoria = ?",
			[nombre_categoria, estado, id_categoria]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Categoría actualizada",
			});
		} else {
			res.status(404).json({
				status: 404,
				message: "Categoría no encontrada o no se realizaron cambios",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Eliminar Categoría por ID
export const eliminarCategoria = async (req, res) => {
	const { id_categoria } = req.params;

	try {
		// Verificar si la categoría está siendo utilizada en la tabla mascotas
		const [rows] = await pool.query(
			"SELECT COUNT(*) AS count FROM razas WHERE fk_id_categoria = ?",
			[id_categoria]
		);

		if (rows[0].count > 0) {
			return res.status(400).json({
				message:
					"La categoría no puede ser eliminada porque está siendo utilizada.",
			});
		}

		// Si no está siendo utilizada, procedemos a eliminarla
		await pool.query("DELETE FROM categorias WHERE id_categoria = ?", [
			id_categoria,
		]);

		res.status(200).json({ message: "Categoría eliminada con éxito." });
	} catch (error) {
		res.status(500).json({ message: "Error del servidor: " + error.message });
	}
};

// Desactivar Categoria
export const desactivarCategoria = async (req, res) => {
	try {
		const { id_categoria } = req.params;

		await pool.query("START TRANSACTION");

		// Verificar si la categoría está siendo utilizada por alguna raza
		const [checkRaza] = await pool.query(
			"SELECT COUNT(*) AS count FROM razas WHERE fk_id_categoria = ?",
			[id_categoria]
		);

		if (checkRaza[0].count > 0) {
			await pool.query("ROLLBACK");
			return res.status(400).json({
				status: 400,
				message:
					"No se puede desactivar la categoría porque está en uso por una raza.",
			});
		}

		const [currentResult] = await pool.query(
			"SELECT estado FROM categorias WHERE id_categoria = ?",
			[id_categoria]
		);

		if (currentResult.length === 0) {
			await pool.query("ROLLBACK");
			return res.status(404).json({
				status: 404,
				message:
					"La categoría con el id " + id_categoria + " no fue encontrada.",
			});
		}

		const currentState = currentResult[0].estado;

		// Cambiar el estado de 'activa' a 'inactiva' o viceversa
		const nuevoEstado = currentState === "activa" ? "inactiva" : "activa";

		await pool.query(
			"UPDATE categorias SET estado = ? WHERE id_categoria = ?",
			[nuevoEstado, id_categoria]
		);

		// Confirmar la transacción
		await pool.query("COMMIT");

		res.status(200).json({
			status: 200,
			message:
				"El estado de la categoría ha sido cambiado a " + nuevoEstado + ".",
		});
	} catch (error) {
		// Si ocurre un error, deshace la transacción
		await pool.query("ROLLBACK");
		res.status(500).json({
			status: 500,
			message: "Error en el sistema: " + error.message,
		});
	}
};

// Buscar Categoría por ID
export const buscarCategoria = async (req, res) => {
	try {
		const { id_categoria } = req.params;
		const [result] = await pool.query(
			"SELECT * FROM categorias WHERE id_categoria=?",
			[id_categoria]
		);
		if (result.length > 0) {
			res.status(200).json({
				status: 200,
				message: "Categoría encontrada",
				data: result[0],
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "Categoría no encontrada",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};
