import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Listar Municipios
export const listarMunicipios = async (req, res) => {
	try {
		const [result] = await pool.query(`
			SELECT 
				m.id_municipio, 
				m.nombre_municipio, 
				m.codigo_dane, 
				m.fk_id_departamento, 
				d.nombre_departamento 
			FROM 
				municipios m
			INNER JOIN 
				departamentos d ON m.fk_id_departamento = d.id_departamento
		`);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay municipios para listar"
			})
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Municipio
export const registrarMunicipio = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { nombre_municipio, codigo_dane, fk_id_departamento } = req.body;

		// Verificar si el código DANE ya está registrado en la tabla departamentos o municipios
		const [existingDepartment] = await pool.query(
			"SELECT * FROM departamentos WHERE codigo_dane = ?",
			[codigo_dane]
		);

		const [existingMunicipio] = await pool.query(
			"SELECT * FROM municipios WHERE codigo_dane = ?",
			[codigo_dane]
		);

		if (existingDepartment.length > 0 || existingMunicipio.length > 0) {
			return res.status(400).json({
				status: 400,
				message: "El código DANE ya está registrado en otro departamento o municipio",
			});
		}

		// Insertar el nuevo municipio si no hay código DANE duplicado
		const [result] = await pool.query(
			"INSERT INTO municipios (nombre_municipio, codigo_dane, fk_id_departamento) VALUES (?, ?, ?)",
			[nombre_municipio, codigo_dane, fk_id_departamento]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Municipio registrado exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo registrar el municipio",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Actualizar Municipio por ID
export const actualizarMunicipio = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { id_municipio } = req.params;
		const { nombre_municipio, codigo_dane, fk_id_departamento } = req.body;

		// Verificar si el municipio actual ya tiene el código DANE que se está intentando actualizar
		const [currentMunicipio] = await pool.query(
			"SELECT codigo_dane FROM municipios WHERE id_municipio = ?",
			[id_municipio]
		);

		if (currentMunicipio.length === 0) {
			return res.status(404).json({
				status: 404,
				message: "Municipio no encontrado",
			});
		}

		// Solo hacer la verificación si el código DANE es diferente al actual
		if (currentMunicipio[0].codigo_dane !== codigo_dane) {
			// Verificar si el código DANE ya está registrado en otros departamentos o municipios
			const [existingDepartment] = await pool.query(
				"SELECT * FROM departamentos WHERE codigo_dane = ?",
				[codigo_dane]
			);

			const [existingMunicipio] = await pool.query(
				"SELECT * FROM municipios WHERE codigo_dane = ? AND id_municipio != ?",
				[codigo_dane, id_municipio]
			);

			if (existingDepartment.length > 0 || existingMunicipio.length > 0) {
				return res.status(400).json({
					status: 400,
					message: "El código DANE ya está registrado en otro departamento o municipio",
				});
			}
		}

		// Realizar la actualización del municipio
		const [result] = await pool.query(
			"UPDATE municipios SET nombre_municipio=?, codigo_dane=?, fk_id_departamento=? WHERE id_municipio=?",
			[nombre_municipio, codigo_dane, fk_id_departamento, id_municipio]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Municipio actualizado exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo actualizar el municipio",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Eliminar Municipio por ID
export const eliminarMunicipio = async (req, res) => {
    const { id_municipio } = req.params;

    try {
        // Verificar si hay mascotas asociadas al municipio
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM mascotas WHERE fk_id_municipio = ?",
            [id_municipio]
        );

        if (rows[0].count > 0) {
            return res.status(400).json({
                status: 400,
                message: "El municipio no puede ser eliminado porque hay mascotas registradas en él.",
            });
        }

        // Si no hay mascotas, proceder a eliminar el municipio
        const [result] = await pool.query(
            "DELETE FROM municipios WHERE id_municipio = ?",
            [id_municipio]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: "Municipio eliminado",
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Municipio no encontrado",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};

// Buscar Municipio por ID
export const buscarMunicipio = async (req, res) => {
	try {
		const { id_municipio } = req.params;
		const [result] = await pool.query(
			"SELECT * FROM municipios WHERE id_municipio=?",
			[id_municipio]
		);
		if (result.length > 0) {
			res.status(200).json({
				status: 200,
				message: "Municipio encontrado",
				data: result[0],
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "Municipio no encontrado",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};
