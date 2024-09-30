import { check } from 'express-validator';

// Validaciones para la creación de municipios
export const validateCrearMunicipio = [
    check('nombre_municipio', 'El nombre del municipio es obligatorio y debe ser una cadena de texto.')
        .not()
        .isEmpty()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre del municipio solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre del municipio no puede exceder los 50 caracteres.'),

    check('codigo_dane', 'El código DANE es obligatorio y debe ser una cadena de texto de máximo 10 caracteres.')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max: 10 }).withMessage('El código DANE no puede exceder los 10 caracteres.')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('El código DANE solo puede contener letras y números.'),

    check('fk_id_departamento', 'El ID del departamento debe ser un número entero válido.')
        .not()
        .isEmpty()
        .isInt().withMessage('El ID del departamento debe ser un número entero.'),
];

// Validaciones para la actualización de municipios
export const validateActualizarMunicipio = [
    check('nombre_municipio')
        .optional()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre del municipio solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre del municipio no puede exceder los 50 caracteres.'),

    check('codigo_dane')
        .optional()
        .isString()
        .isLength({ max: 10 }).withMessage('El código DANE no puede exceder los 10 caracteres.')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('El código DANE solo puede contener letras y números.'),

    check('fk_id_departamento')
        .optional()
        .isInt().withMessage('El ID del departamento debe ser un número entero.'),
];
