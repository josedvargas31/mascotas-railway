import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Listar Razas
export const listarRazas = async (req, res) => {
	try {
		const [result] = await pool.query(`
      SELECT 
          r.id_raza, 
          r.nombre_raza, 
		  r.fk_id_categoria, 
          c.nombre_categoria
      FROM razas r
      INNER JOIN categorias c ON r.fk_id_categoria = c.id_categoria
  `);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay razas para listar",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Raza
export const registrarRaza = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { nombre_raza, fk_id_categoria } = req.body;
		const [result] = await pool.query(
			"INSERT INTO razas (nombre_raza, fk_id_categoria) VALUES (?, ?)",
			[nombre_raza, fk_id_categoria]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Raza registrada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se registró la raza",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Actualizar Raza por ID
export const actualizarRaza = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { id_raza } = req.params;
		const { nombre_raza, fk_id_categoria } = req.body;
		const [result] = await pool.query(
			"UPDATE razas SET nombre_raza=?, fk_id_categoria=? WHERE id_raza=?",
			[nombre_raza, fk_id_categoria, id_raza]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Raza actualizada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se actualizó la raza",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Eliminar Raza por ID
export const eliminarRaza = async (req, res) => {
    const { id_raza } = req.params;

    try {
        // Verificar si la raza está siendo utilizada en otra tabla (por ejemplo, en la tabla de mascotas)
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS count FROM mascotas WHERE fk_id_raza = ?`, 
            [id_raza]
        );

        if (rows[0].count > 0) {
            return res.status(400).json({
                message: "La raza no puede ser eliminada porque hay mascotas registradas en él."
            });
        }

        // Si no está siendo utilizada, proceder con la eliminación
        await pool.query("DELETE FROM razas WHERE id_raza = ?", [id_raza]);
        res.status(200).json({ message: "Raza eliminada correctamente." });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor." });
    }
};


// Buscar Raza por ID
export const buscarRaza = async (req, res) => {
	try {
		const { id_raza } = req.params;
		const [result] = await pool.query("SELECT * FROM razas WHERE id_raza=?", [
			id_raza,
		]);
		if (result.length > 0) {
			res.status(200).json({
				status: 200,
				message: "Raza encontrada",
				data: result[0],
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "Raza no encontrada",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};
