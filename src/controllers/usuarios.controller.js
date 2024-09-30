import { pool } from "../database/conexion.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
// import { validationResult } from "express-validator";

// listar usuarios
export const listarUsuarios = async (req, res) => {
	try {
		const [result] = await pool.query("SELECT * FROM usuarios");
		if (result.length > 0) {
				res.status(200).json(result);
		} else {
			res.status(403).json({
				status: 403,
				message: "No hay usuarios para listar",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Registrar Usuario
export const registrarUsuario = async (req, res) => {
	try {
		// Desestructurar datos del cuerpo de la solicitud
		const {
			nombre,
			apellido,
			direccion,
			telefono,
			correo,
			tipo_documento,
			documento_identidad,
			password,
			rol,
		} = req.body;
		const img = req.file ? req.file.filename : null; // Obtener el nombre del archivo de la solicitud

		// Verificar si el correo ya está registrado
		const [correoExistente] = await pool.query(
			"SELECT * FROM usuarios WHERE correo = ?",
			[correo]
		);

		if (correoExistente.length > 0) {
			return res.status(400).json({
				status: 400,
				message: "El correo ya está registrado",
			});
		}

		// Verificar si el documento de identidad ya está registrado
		const [documentoExistente] = await pool.query(
			"SELECT * FROM usuarios WHERE documento_identidad = ?",
			[documento_identidad]
		);

		if (documentoExistente.length > 0) {
			return res.status(400).json({
				status: 400,
				message: "El documento de identidad ya está registrado",
			});
		}

		// Cifrar la contraseña antes de guardarla
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Insertar datos en la tabla Usuarios
		const [result] = await pool.query(
			"INSERT INTO usuarios (nombre, apellido, direccion, telefono, correo, tipo_documento, documento_identidad, password, img, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				nombre,
				apellido,
				direccion,
				telefono,
				correo,
				tipo_documento,
				documento_identidad,
				hashedPassword, // Guardar la contraseña encriptada
				img,
				rol,
			]
		);

		// Verificar si la inserción fue exitosa
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Usuario registrado exitosamente",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se pudo registrar el usuario",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Actualizar Usuario
export const actualizarUsuario = async (req, res) => {
	try {
		const { id_usuario } = req.params;
		const {
			nombre,
			apellido,
			direccion,
			telefono,
			correo,
			tipo_documento,
			documento_identidad,
			password,
			rol,
		} = req.body;
		const img = req.file ? req.file.filename : null; // Obtener el nombre del archivo de la solicitud

		// Obtener el usuario actual
		const [currentUsuario] = await pool.query(
			"SELECT img, password FROM usuarios WHERE id_usuario=?",
			[id_usuario]
		);
		const currentImg = currentUsuario.length > 0 ? currentUsuario[0].img : null;
		const currentPassword =
			currentUsuario.length > 0 ? currentUsuario[0].password : null;

		// Encriptar la nueva contraseña si se proporciona
		const hashedPassword = password
			? await bcrypt.hash(password, 10)
			: currentPassword;

		const [result] = await pool.query(
			"UPDATE usuarios SET nombre=?, apellido=?, direccion=?, telefono=?, correo=?, tipo_documento=?, documento_identidad=?, password=?, img=?, rol=? WHERE id_usuario=?",
			[
				nombre,
				apellido,
				direccion,
				telefono,
				correo,
				tipo_documento,
				documento_identidad,
				hashedPassword,
				img || currentImg,
				rol,
				id_usuario,
			]
		);

		if (result.affectedRows > 0) {
			if (img && currentImg) {
				// Eliminar la imagen anterior del servidor
				fs.unlink(path.join("uploads", currentImg), (err) => {
					if (err)
						console.error("No se pudo eliminar la imagen anterior:", err);
				});
			}

			res.status(200).json({
				status: 200,
				message: "Usuario actualizado exitosamente",
				data: { ...req.body, img: img || currentImg },
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se actualizó el usuario",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

// Eliminar Usuario por ID
export const eliminarUsuario = async (req, res) => {
	try {
		const { id_usuario } = req.params;
		const [result] = await pool.query(
			"DELETE FROM usuarios WHERE id_usuario=?",
			[id_usuario]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({
				status: 200,
				message: "Usuario eliminado",
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se eliminó el usuario",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor " + error.message,
		});
	}
};

// Controlador para obtener conteo de mascotas por estado
export const obtenerConteoPorEstado = async (req, res) => {
	try {
		// Consulta para obtener el conteo de mascotas por estado
		const [result] = await pool.query(`
			SELECT rol, COUNT(*) as total
			FROM usuarios
			GROUP BY rol
		`);
  
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: 'Error en el sistema: ' + error.message
		});
	}
  };
// Verificar existencia de correo o documento de identidad
export const verificarExistencia = async (req, res) => {
	try {
		const { tipo, valor } = req.params;

		let query;
		let params;

		// Determinar la consulta SQL y los parámetros basados en el tipo de verificación
		if (tipo === "correo") {
			query = "SELECT COUNT(*) AS existe FROM usuarios WHERE correo = ?";
			params = [valor];
		} else if (tipo === "documento_identidad") {
			query =
				"SELECT COUNT(*) AS existe FROM usuarios WHERE documento_identidad = ?";
			params = [valor];
		} else {
			return res.status(400).json({ error: "Tipo de verificación no válido" });
		}

		// Consultar en la base de datos si el valor existe
		const [result] = await pool.query(query, params);

		// Enviar respuesta basada en el resultado de la consulta
		res.json({ existe: result[0].existe > 0 });
	} catch (error) {
		console.error("Error al verificar existencia:", error);
		res.status(500).json({ error: "Error en el servidor" });
	}
};

//canacue
//perfil y solicitud de cambio de rol
//perfil:
export const Perfil = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const [result] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id_usuario]);

        if (result.length > 0) {
            const usuariosConImagenes = result.map(usuario => ({
                ...usuario,
                img: usuario.img ? `${req.protocol}://${req.get('host')}/uploads/${usuario.img}` : null
            }));

            res.status(200).json(usuariosConImagenes);
        } else {
            res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor " + error.message,
        });
    }
};
//actualizar perfil 
export const actualizarPerfilUsuario = async (req, res) => {
	try {
		const { id_usuario } = req.params;
		const {
			nombre,
			apellido,
			direccion,
			telefono,
			correo,
			tipo_documento,
			password,
		} = req.body;
		const img = req.file ? req.file.filename : null; // Obtener el nombre del archivo de la solicitud

		// Obtener el usuario actual
		const [currentUsuario] = await pool.query(
			"SELECT img, password FROM usuarios WHERE id_usuario=?",
			[id_usuario]
		);
		const currentImg = currentUsuario.length > 0 ? currentUsuario[0].img : null;
		const currentPassword =
			currentUsuario.length > 0 ? currentUsuario[0].password : null;

		// Encriptar la nueva contraseña si se proporciona
		const hashedPassword = password
			? await bcrypt.hash(password, 10)
			: currentPassword;

		const [result] = await pool.query(
			"UPDATE usuarios SET nombre=?, apellido=?, direccion=?, telefono=?, correo=?, tipo_documento=?, password=?, img=? WHERE id_usuario=?",
			[
				nombre,
				apellido,
				direccion,
				telefono,
				correo,
				tipo_documento,
				hashedPassword,
				img || currentImg,
				id_usuario,
			]
		);

		if (result.affectedRows > 0) {
			if (img && currentImg) {
				// Eliminar la imagen anterior del servidor
				fs.unlink(path.join("uploads", currentImg), (err) => {
					if (err)
						console.error("No se pudo eliminar la imagen anterior:", err);
				});
			}

			res.status(200).json({
				status: 200,
				message: "Usuario actualizado exitosamente",
				data: { ...req.body, img: img || currentImg },
			});
		} else {
			res.status(403).json({
				status: 403,
				message: "No se actualizó el usuario",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error en el servidor: " + error.message,
		});
	}
};

//notificaciones:
//solicitar cambio de rol
export const solicitarCambioRol = async (req, res) => {
    try {
        const { id_usuario, nuevoRol } = req.params;
        const [usuarioRows] = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id_usuario]);

        if (usuarioRows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado",
            });
        }

        const usuarioActual = usuarioRows[0];
        const rolActual = usuarioActual.rol;

        if (rolActual === 'superusuario') {
            return res.status(403).json({
                status: 403,
                message: "Los superusuarios no pueden solicitar cambios de rol",
            });
        }

        // Obtener el ID del super-usuario
        const [superUsuarioRows] = await pool.query("SELECT id_usuario FROM usuarios WHERE rol = 'superusuario'");
        if (superUsuarioRows.length > 0) {
            const idSuperUsuario = superUsuarioRows[0].id_usuario;

            // Enviar notificación al Super-Usuario con el ID del usuario solicitante
            const [result] = await pool.query(
                "INSERT INTO notificaciones (id_usuario, mensaje, leido, estado) VALUES (?, ?, ?, ?)",
                [idSuperUsuario, `El usuario ${id_usuario} ha solicitado cambiar su rol de ${rolActual} a ${nuevoRol}`, false, 'pendiente']
            );

            if (result.affectedRows > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Solicitud de cambio de rol enviada exitosamente",
                });
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "No se pudo registrar la solicitud",
                });
            }
        } else {
            return res.status(404).json({
                status: 404,
                message: "Super-Usuario no encontrado",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};
//listar notificaciones
export const listarNotificaciones = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        // Consulta las notificaciones del usuario
        const query = `
            SELECT n.id_notificacion, 
                   n.mensaje, 
                   n.leido, 
                   n.fecha, 
                   n.estado
            FROM notificaciones n
            WHERE n.id_usuario = ?
        `;
        const [notificaciones] = await pool.query(query, [id_usuario]);

        // Obtener información del usuario que hizo la solicitud
        const resultados = await Promise.all(notificaciones.map(async (notificacion) => {
            // Extraer el id_usuario del mensaje
            const mensajeParts = notificacion.mensaje.split(' ');
            const idSolicitante = mensajeParts.find(part => !isNaN(part));
            
            // Obtener información del usuario
            const [usuario] = await pool.query("SELECT nombre, correo FROM usuarios WHERE id_usuario = ?", [idSolicitante]);
            return {
                ...notificacion,
                nombre_solicitante: usuario.length > 0 ? usuario[0].nombre : 'Desconocido',
                correo_solicitante: usuario.length > 0 ? usuario[0].correo : 'Desconocido',
            };
        }));

        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};
//manejar notificaciones
export const manejarNotificacion = async (req, res) => {
    try {
        const { id_notificacion } = req.params;
        const { estado } = req.body; // Puede ser 'aceptada' o 'rechazada'

        // Validar el estado recibido
        if (estado !== 'aceptada' && estado !== 'rechazada') {
            return res.status(400).json({
                status: 400,
                message: "Estado inválido. Debe ser 'aceptada' o 'rechazada'."
            });
        }

        // Actualizar el estado de la notificación
        const [result] = await pool.query("UPDATE notificaciones SET estado = ? WHERE id_notificacion = ?", [estado, id_notificacion]);
        
        if (result.affectedRows > 0) {
            // Obtener la notificación actualizada
            const [updatedNotification] = await pool.query("SELECT * FROM notificaciones WHERE id_notificacion = ?", [id_notificacion]);
            const notificacion = updatedNotification[0];
            
            // Extraer el ID del usuario solicitante
            const mensajeParts = notificacion.mensaje.split(' ');
            const idSolicitante = mensajeParts.find(part => !isNaN(part));
            
            // Obtener información del super-usuario
            const [superUsuarioRows] = await pool.query("SELECT nombre, telefono FROM usuarios WHERE rol = 'superusuario'");
            const superUsuario = superUsuarioRows[0];

            // Crear una nueva notificación para el usuario solicitante dependiendo del estado
            let mensajeNotificacion;
            if (estado === 'aceptada') {
                mensajeNotificacion = `El Super Usuario ${superUsuario.nombre} ha aceptado tu solicitud de cambio de rol. Para continuar con el cambio de rol, debes comunicarte al WhatsApp ${superUsuario.telefono} de ${superUsuario.nombre} para confirmar el cambio.`;
            } else if (estado === 'rechazada') {
                mensajeNotificacion = `Tu solicitud de cambio de rol fue denegada por el Super Usuario ${superUsuario.nombre}.`;
            }

            await pool.query(
                "INSERT INTO notificaciones (id_usuario, mensaje, leido, estado) VALUES (?, ?, ?, ?)",
                [idSolicitante, mensajeNotificacion, false, 'pendiente']
            );

            res.status(200).json({
                status: 200,
                message: `Solicitud ${estado} exitosamente`,
                data: notificacion,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Notificación no encontrada",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};

//eliminar notificaciones
export const eliminarNotificacion = async (req, res) => {
    try {
        const { id_notificacion } = req.params;

        // Eliminar la notificación de la base de datos
        const [result] = await pool.query("DELETE FROM notificaciones WHERE id_notificacion = ?", [id_notificacion]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: "Notificación eliminada exitosamente",
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "Notificación no encontrada",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el servidor: " + error.message,
        });
    }
};

//recuperacion de contraseña

export const solicitarResetPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        // Verificar si el correo está registrado
        const [usuario] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        // Si el correo existe, simplemente devuelves un mensaje de éxito
        res.status(200).json({ message: "Correo verificado, por favor ingresa la nueva contraseña." });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor: " + error.message });
    }
};


export const updatePassword = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Verificar si el correo está registrado
        const [usuario] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        // Cifrar la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar la contraseña del usuario
        await pool.query("UPDATE usuarios SET password = ? WHERE correo = ?", [hashedPassword, correo]);

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor: " + error.message });
    }
};  

