import { check } from 'express-validator';

// Validaciones para la creación de razas
export const validateCrearRaza = [
    check('nombre_raza', 'El nombre de la raza es obligatorio y debe ser una cadena de texto.')
        .not()
        .isEmpty()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre de la raza solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre de la raza no puede exceder los 50 caracteres.'),

    check('fk_id_categoria', 'El ID de la categoría debe ser un número entero válido.')
        .not()
        .isEmpty()
        .isInt().withMessage('El ID de la categoría debe ser un número entero.'),
];

// Validaciones para la actualización de razas
export const validateActualizarRaza = [
    check('nombre_raza')
        .optional()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre de la raza solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre de la raza no puede exceder los 50 caracteres.'),

    check('fk_id_categoria')
        .optional()
        .isInt().withMessage('El ID de la categoría debe ser un número entero.'),
];
