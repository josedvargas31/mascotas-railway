import { pool } from "../database/conexion.js";
// import { validationResult } from "express-validator";

// Listar Vacunas
export const listarVacunas = async (req, res) => {
	try {
		const [result] = await pool.query(`
      SELECT 
        v.id_vacuna,
        v.fk_id_mascota,
        m.nombre_mascota,
        v.fecha_vacuna,
        v.enfermedad,
        v.estado
      FROM vacunas v
      LEFT JOIN mascotas m ON v.fk_id_mascota = m.id_mascota
    `);

		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay vacunas para listar",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Listar Vacunas asociadas a la mascota
export const listarVacunasAsociadaAMascota = async (req, res) => {
	const { id_mascota } = req.params;
	try {
		const [result] = await pool.query(
			"SELECT * FROM vacunas WHERE fk_id_mascota=?",
			[id_mascota]
		);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay vacunas para listar",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Vacuna
export const registrarVacuna = async (req, res) => {
	try {
		const { fk_id_mascota, fecha_vacuna, enfermedad, estado } = req.body;
		const [result] = await pool.query(
			"INSERT INTO vacunas (fk_id_mascota, fecha_vacuna, enfermedad, estado) VALUES (?, ?, ?, ?)",
			[fk_id_mascota, fecha_vacuna, enfermedad, estado]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Vacuna registrada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se registró la vacuna",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Actualizar Vacuna por ID
export const actualizarVacuna = async (req, res) => {
	try {
		const { id_vacuna } = req.params;
		const { fk_id_mascota, fecha_vacuna, enfermedad, estado } = req.body;

		if (!fk_id_mascota || !fecha_vacuna || !enfermedad || !estado) {
			return res.status(400).json({ message: "Faltan campos en la solicitud" });
		}

		const [result] = await pool.query(
			"UPDATE vacunas SET fk_id_mascota=?, fecha_vacuna=?, enfermedad=?, estado=? WHERE id_vacuna=?",
			[fk_id_mascota, fecha_vacuna, enfermedad, estado, id_vacuna]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Vacuna actualizada",
			});
		} else {
			res.status(404).json({
				status: 404,
				message: "Vacuna no encontrada",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Eliminar Vacuna por ID
export const eliminarVacuna = async (req, res) => {
	try {
		const { id_vacuna } = req.params;
		const [result] = await pool.query("DELETE FROM vacunas WHERE id_vacuna=?", [
			id_vacuna,
		]);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Vacuna eliminada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se eliminó la vacuna",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Buscar Vacuna por ID
export const buscarVacuna = async (req, res) => {
	try {
		const { id_vacuna } = req.params;
		const [result] = await pool.query(
			"SELECT * FROM vacunas WHERE id_vacuna=?",
			[id_vacuna]
		);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "Vacuna no encontrada",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};
