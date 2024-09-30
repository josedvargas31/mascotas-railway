import { pool } from "../database/conexion.js";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// Validar usuario
export const validar = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Consultar al usuario por correo
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE BINARY correo = ?',
            [correo]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // Comparar la contraseña ingresada con la contraseña encriptada
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Incluir la identificación del usuario en el token JWT
                const token = Jwt.sign(
                    { user: user.id_usuario }, 
                    process.env.AUT_SECRET,
                    { expiresIn: process.env.AUT_EXPIRE }
                );
                return res.status(200).json({
                    user: user, 
                    token: token,
                    message: "Token generado con éxito",
                });
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "El correo o la contraseña es incorrecto",
                });
            }
        } else {
            return res.status(404).json({
                status: 404,
                message: "Usuario no autorizado",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error del servidor: " + error.message,
        });
    }
};


// verificar
export const validarToken = async (req, res, next) => {
	try {
		let tokenClient = req.headers["token"];

		if (!tokenClient) {
			res.status(403).json({
				status: 403,
				message: "Token es requerido",
			});
		} else {
			Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
				if (error) {
					res.status(403).json({
						status: 403,
						message: "Token es inválido o ha expirado",
					});
				} else {
					// Decodificar el token y establecer req.usuario
					req.usuario = decoded.user;
					next();
				}
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Error del servidor: " + error.message,
		});
	}
};
