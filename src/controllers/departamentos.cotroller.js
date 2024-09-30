import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Listar Departamentos
export const listarDepartamentos = async (req, res) => {
	try {
		const [result] = await pool.query("SELECT * FROM departamentos");
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay departamentos para listar"
			})
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Departamento
export const registrarDepartamento = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { nombre_departamento, codigo_dane } = req.body;

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

		// Insertar el nuevo departamento si no hay código DANE duplicado
		const [result] = await pool.query(
			"INSERT INTO departamentos (nombre_departamento, codigo_dane) VALUES (?, ?)",
			[nombre_departamento, codigo_dane]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Departamento registrado exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo registrar el departamento",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Actualizar Departamento por ID
export const actualizarDepartamento = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { id_departamento } = req.params;
		const { nombre_departamento, codigo_dane } = req.body;

		// Verificar si el departamento actual ya tiene el código DANE que se está intentando actualizar
		const [currentDepartment] = await pool.query(
			"SELECT codigo_dane FROM departamentos WHERE id_departamento = ?",
			[id_departamento]
		);

		if (currentDepartment.length === 0) {
			return res.status(404).json({
				status: 404,
				message: "Departamento no encontrado",
			});
		}

		// Solo hacer la verificación si el código DANE es diferente al actual
		if (currentDepartment[0].codigo_dane !== codigo_dane) {
			// Verificar si el código DANE ya está registrado en otros departamentos o municipios
			const [existingDepartment] = await pool.query(
				"SELECT * FROM departamentos WHERE codigo_dane = ? AND id_departamento != ?",
				[codigo_dane, id_departamento]
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
		}

		// Realizar la actualización del departamento
		const [result] = await pool.query(
			"UPDATE departamentos SET nombre_departamento=?, codigo_dane=? WHERE id_departamento=?",
			[nombre_departamento, codigo_dane, id_departamento]
		);

		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Departamento actualizado exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo actualizar el departamento",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Eliminar Departamento por ID
export const eliminarDepartamento = async (req, res) => {
	const { id_departamento } = req.params;
  
	try {
	  // Verificar si el departamento está siendo utilizado en la tabla municipios
	  const [rows] = await pool.query(
		"SELECT COUNT(*) AS count FROM municipios WHERE fk_id_departamento = ?",
		[id_departamento]
	  );
  
	  if (rows[0].count > 0) {
		return res.status(400).json({
		    message: "El departamento no puede ser eliminado porque está siendo utilizado."
		});
	  }
  
	  // Si no está siendo utilizado, procedemos a eliminarlo
	  const [result] = await pool.query("DELETE FROM departamentos WHERE id_departamento = ?", [id_departamento]);
  
	  if (result.affectedRows > 0) {
		res.status(200).json({ message: "Departamento eliminado con éxito." });
	  } else {
		res.status(404).json({ message: "Departamento no encontrado." });
	  }
	} catch (error) {
	  res.status(500).json({ message: "Error del servidor: " + error.message });
	}
  };
  

// Buscar Departamento por ID
export const buscarDepartamento = async (req, res) => {
	try {
		const { id_departamento } = req.params;
		const [result] = await pool.query(
			"SELECT * FROM Departamentos WHERE id_departamento=?",
			[id_departamento]
		);
		if (result.length > 0) {
			res.status(200).json({
				status: 200,
				message: "Departamento encontrado",
				data: result[0],
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "Departamento no encontrado",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};
