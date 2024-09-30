import { check } from "express-validator";

// validación de regsitro de usuario
export const validateRegistroUsuario = [
	check(
		"documento_identidad",
		"La identificación es obligatoria y debe contener exactamente 10 dígitos"
	)
		.not()
		.isEmpty()
		.isLength({ min: 10, max: 10 })
		.isNumeric(),
	

	check(
		"nombres",
		"El nombre es obligatorio y debe contener solo letras, máximo 50 caracteres"
	)
		.not()
		.isEmpty()
		.isLength({ max: 50 })
		.matches(/^[A-Za-z\s]+$/),

	check(
		"apellidos",
		"El apellido es obligatorio y debe contener solo letras, máximo 50 caracteres"
	)
		.not()
		.isEmpty()
		.isLength({ max: 50 })
		.matches(/^[A-Za-z\s]+$/),

	check("correo", "Correo es obligatorio y debe ser un correo válido")
		.not()
		.isEmpty()
		.isEmail()
		.normalizeEmail(),

		check(
			"telefono",
			"El número de celular es obligatorio y debe contener exactamente 10 dígitos"
		)
			.not()
			.isEmpty()
			.isLength({ min: 10, max: 10 })
			.isNumeric(),
		

	check(
		"password",
		"La contraseña es obligatoria y debe tener al menos 6 caracteres"
	)
		.not()
		.isEmpty()
		.isLength({ min: 6 }),

	check(
		"rol",
		"Rol es obligatorio y debe ser uno de los siguientes valores: administrador, usuario"
	)
		.not()
		.isEmpty()
		.isIn(["administrador", "usuario"]),
];

// validación de actualizar usuario
export const validateActualizarUsuario = [
	check(
		"identificacion",
		"La identificación es obligatoria y debe contener exactamente 10 dígitos"
	)
	.not()
	.isEmpty()
	.isLength({ min: 10, max: 10 })
	.isNumeric(),

	check(
		"nombres",
		"El nombre es obligatorio y debe contener solo letras, máximo 50 caracteres"
	)
		.optional()
		.not()
		.isEmpty()
		.isLength({ max: 50 })
		.matches(/^[A-Za-z\s]+$/),

	check(
		"apellidos",
		"El apellido es obligatorio y debe contener solo letras, máximo 50 caracteres"
	)
		.optional()
		.not()
		.isEmpty()
		.isLength({ max: 50 })
		.matches(/^[A-Za-z\s]+$/),

	check("correo", "Correo debe ser un correo válido")
		.optional()
		.not()
		.isEmpty()
		.isEmail()
		.normalizeEmail(),

	check(
		"numero_cel",
		"El número de celular es obligatorio y debe contener exactamente 10 dígitos"
	)
	.not()
	.isEmpty()
	.isLength({ min: 10, max: 10 })
	.isNumeric(),

	check("password", "La contraseña debe tener al menos 8 caracteres")
		.optional()
		.not()
		.isEmpty()
		.isLength({ min: 8 }),

	check(
		"rol",
		"Rol debe ser uno de los siguientes valores: administrador, usuario"
	)
		.optional()
		.not()
		.isEmpty()
		.isIn(["administrador", "usuario"]),
];
