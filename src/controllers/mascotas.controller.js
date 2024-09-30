import { pool } from "../database/conexion.js";
import fs from 'fs';
import path from 'path';
import { validationResult } from "express-validator";
import { generatePDF } from '../utils/pdfGenerator.js';

// Listar Mascotas con Imágenes, Detalles Asociados y FKs
export const listarMascotas = async (req, res) => {
	try {
		// Consulta SQL para obtener mascotas, sus imágenes y detalles asociados
		// Aseguramos que las relaciones fk_id_raza -> fk_id_categoria y fk_id_municipio -> fk_id_departamento sean correctas
		const [result] = await pool.query(`
            SELECT 
                m.id_mascota,
                m.nombre_mascota,
                m.fecha_nacimiento,
                m.estado,
                m.descripcion,
                m.esterilizado,
                m.tamano,
                m.peso,
                
                -- Obtener categoría a través de la raza
                r.fk_id_categoria,
                c.nombre_categoria AS categoria,

                -- Datos de la raza
                m.fk_id_raza,
                r.nombre_raza AS raza,

                -- Obtener departamento a través del municipio
                mu.fk_id_departamento,
                d.nombre_departamento AS departamento,

                -- Datos del municipio
                m.fk_id_municipio,
                mu.nombre_municipio AS municipio,

                m.sexo,
                
                -- Concatenar imágenes asociadas
                GROUP_CONCAT(i.ruta_imagen) AS imagenes
            FROM mascotas m
            LEFT JOIN imagenes i ON m.id_mascota = i.fk_id_mascota
            LEFT JOIN razas r ON m.fk_id_raza = r.id_raza
            LEFT JOIN categorias c ON r.fk_id_categoria = c.id_categoria -- Relación raza -> categoría
            LEFT JOIN municipios mu ON m.fk_id_municipio = mu.id_municipio
            LEFT JOIN departamentos d ON mu.fk_id_departamento = d.id_departamento -- Relación municipio -> departamento
            GROUP BY m.id_mascota;
        `);

		// Verificar si hay resultados y responder
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay mascotas para listar",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Registrar Mascota
export const registrarMascota = async (req, res) => {
	try {
		// Validar los datos
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			nombre_mascota,
			fecha_nacimiento,
			estado = "En Adopcion", // Valor por defecto
			descripcion,
			esterilizado,
			tamano,
			peso,
			fk_id_categoria,
			fk_id_raza,
			fk_id_departamento,
			fk_id_municipio,
			sexo,
		} = req.body;

		const files = req.files || []; // Si no hay archivos, usar un array vacío

		// Insertar la nueva mascota
		const [result] = await pool.query(
			"INSERT INTO mascotas (nombre_mascota, fecha_nacimiento, estado, descripcion, esterilizado, tamano, peso, fk_id_categoria, fk_id_raza, fk_id_departamento, fk_id_municipio, sexo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				nombre_mascota,
				fecha_nacimiento,
				estado,
				descripcion,
				esterilizado,
				tamano,
				parseFloat(peso),
				fk_id_categoria,
				fk_id_raza,
				fk_id_departamento,
				fk_id_municipio,
				sexo,
			]
		);

		const idMascota = result.insertId; // Obtener el ID de la nueva mascota

		// Si se suben imágenes, insertarlas en la tabla imagenes
		if (Array.isArray(files) && files.length > 0) {
			const imageQueries = files.map((file) =>
				pool.query(
					"INSERT INTO imagenes (fk_id_mascota, ruta_imagen) VALUES (?, ?)",
					[idMascota, file.filename] // file.filename contiene solo el nombre del archivo
				)
			);
			await Promise.all(imageQueries); // Ejecutar todas las consultas de inserción
		}

		// Verificar si la mascota fue registrada exitosamente
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Mascota registrada exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo registrar la mascota",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Controlador para obtener conteo de mascotas por estado
export const obtenerConteoPorEstado = async (req, res) => {
	try {
		// Consulta para obtener el conteo de mascotas por estado
		const [result] = await pool.query(`
          SELECT estado, COUNT(*) as total
          FROM mascotas
          GROUP BY estado
      `);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay mascotas registrardas",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el sistema: " + error.message,
		});
	}
};

// Actualizar Mascota por ID
export const actualizarMascota = async (req, res) => {
    try {
        // Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { id_mascota } = req.params;
        const {
            nombre_mascota,
            fecha_nacimiento,
            estado,
            descripcion,
            esterilizado,
            tamano,
            peso,
            fk_id_categoria,
            fk_id_raza,
            fk_id_departamento,
            fk_id_municipio,
            sexo,
            imagenesExistentes = [], // Imágenes existentes enviadas desde el formulario
        } = req.body;
        const nuevasFotos = req.files || []; // Nuevas imágenes subidas

        // Actualizar la información de la mascota
        const [result] = await pool.query(
            `UPDATE mascotas 
             SET nombre_mascota=?, fecha_nacimiento=?, estado=?, descripcion=?, 
             esterilizado=?, tamano=?, peso=?, fk_id_categoria=?, fk_id_raza=?, 
             fk_id_departamento=?, fk_id_municipio=?, sexo=? 
             WHERE id_mascota=?`,
            [
                nombre_mascota,
                fecha_nacimiento,
                estado,
                descripcion,
                esterilizado,
                tamano,
                peso,
                fk_id_categoria,
                fk_id_raza,
                fk_id_departamento,
                fk_id_municipio,
                sexo,
                id_mascota,
            ]
        );

        if (result.affectedRows > 0) {
            // Obtener las imágenes actuales de la mascota
            const [imagenesAntiguas] = await pool.query(
                'SELECT ruta_imagen FROM imagenes WHERE fk_id_mascota = ?',
                [id_mascota]
            );

            // Convertir las rutas de las imágenes a un array
            const imagenesAntiguasRutas = imagenesAntiguas.map(img => img.ruta_imagen);

            // Identificar las imágenes que deben eliminarse
            const imagenesParaEliminar = imagenesAntiguasRutas.filter(
                img => !imagenesExistentes.includes(img) && !nuevasFotos.some(file => `${file.filename}` === img)
            );

            // Eliminar imágenes que no deben permanecer
            if (imagenesParaEliminar.length > 0) {
                // Eliminar imágenes de la base de datos
                await Promise.all(imagenesParaEliminar.map(img =>
                    pool.query('DELETE FROM imagenes WHERE ruta_imagen = ?', [img])
                ));

                // Eliminar imágenes del servidor
                imagenesParaEliminar.forEach(img => {
                    try {
                        fs.unlinkSync(`./uploads/${path.basename(img)}`);
                    } catch (unlinkError) {
                        console.error(`Error al eliminar el archivo ${img}: ${unlinkError.message}`);
                    }
                });
            }

            // Insertar nuevas imágenes en la base de datos
            if (nuevasFotos.length > 0) {
                const imageQueries = nuevasFotos.map((file) =>
                    pool.query(
                        "INSERT INTO imagenes (fk_id_mascota, ruta_imagen) VALUES (?, ?)",
                        [id_mascota, `${file.filename}`]
                    )
                );
                await Promise.all(imageQueries);
            }

            // Responder con la actualización exitosa
            res.status(200).json({
                status: 200,
                message: "Mascota actualizada exitosamente",
            });
        } else {
            res.status(403).json({
                status: 403,
                message: "No se pudo actualizar la mascota",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};
// Eliminar Mascota por ID
export const eliminarMascota = async (req, res) => {
	try {
		const { id_mascota } = req.params;
		const [result] = await pool.query(
			"DELETE FROM Mascotas WHERE id_mascota=?",
			[id_mascota]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Mascota eliminada",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se eliminó la mascota",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Buscar Mascota por ID
export const buscarMascota = async (req, res) => {
	try {
		const { id_mascota } = req.params;
		const [result] = await pool.query(
			"SELECT * FROM Mascotas WHERE id_mascota=?",
			[id_mascota]
		);
		if (result.length > 0) {
			res.status(200).json({
				status: 200,
				message: "Mascota encontrada",
				data: result[0],
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "Mascota no encontrada",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};


// Controlador para generar la ficha técnica de la mascota
export const generarFichaTecnica = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener información básica de la mascota, asegurando las relaciones raza -> categoría y municipio -> departamento
        const [mascotaResult] = await pool.query(`
            SELECT 
                m.*, 
                -- Obtener la categoría a través de la raza
                r.fk_id_categoria,
                c.nombre_categoria, 
                
                -- Información de la raza
                r.nombre_raza, 

                -- Obtener el departamento a través del municipio
                mu.fk_id_departamento,
                d.nombre_departamento, 

                -- Información del municipio
                mu.nombre_municipio 
            FROM mascotas m
            LEFT JOIN razas r ON m.fk_id_raza = r.id_raza
            LEFT JOIN categorias c ON r.fk_id_categoria = c.id_categoria -- Relación raza -> categoría
            LEFT JOIN municipios mu ON m.fk_id_municipio = mu.id_municipio
            LEFT JOIN departamentos d ON mu.fk_id_departamento = d.id_departamento -- Relación municipio -> departamento
            WHERE m.id_mascota = ?
        `, [id]);

        // Verificar si la mascota existe
        if (mascotaResult.length === 0) {
            return res.status(404).json({ message: "Mascota no encontrada" });
        }

        const mascota = mascotaResult[0];

        // Obtener vacunas de la mascota
        const [vacunasResult] = await pool.query(`
            SELECT * 
            FROM vacunas 
            WHERE fk_id_mascota = ?
        `, [id]);

        mascota.vacunas = vacunasResult;

        // Obtener una imagen de la mascota
        const [imagenesResult] = await pool.query(`
            SELECT ruta_imagen 
            FROM imagenes 
            WHERE fk_id_mascota = ?
            LIMIT 1
        `, [id]);

        // Asignar la imagen si existe, de lo contrario dejarla como null
        mascota.imagen = imagenesResult.length > 0 ? imagenesResult[0].ruta_imagen : null;

        // Generar el PDF con la información de la mascota
        const pdfBuffer = await generatePDF(mascota);

        // Establecer el encabezado de la respuesta para un archivo PDF
        res.setHeader('Content-Disposition', `attachment; filename=ficha_tecnica_${mascota.nombre_mascota}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el PDF generado
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error en el controlador generarFichaTecnica:", error); // Log error details
        res.status(500).json({ message: "Error en el servidor: " + error.message });
    }
};
