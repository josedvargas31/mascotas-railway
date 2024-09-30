import { check } from 'express-validator';

// Validaciones para la creación de departamentos
export const validateCrearDepartamento = [
    check('nombre_departamento', 'El nombre del departamento es obligatorio y debe ser una cadena de texto.')
        .not()
        .isEmpty()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre del departamento solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre del departamento no puede exceder los 50 caracteres.'),
    
    check('codigo_dane', 'El código DANE es obligatorio y debe ser una cadena de texto de máximo 10 caracteres.')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max: 10 }).withMessage('El código DANE no puede exceder los 10 caracteres.')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('El código DANE solo puede contener letras y números.'),
];

// Validaciones para la actualización de departamentos
export const validateActualizarDepartamento = [
    check('nombre_departamento')
        .optional()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre del departamento solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre del departamento no puede exceder los 50 caracteres.'),
    
    check('codigo_dane')
        .optional()
        .isString()
        .isLength({ max: 10 }).withMessage('El código DANE no puede exceder los 10 caracteres.')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('El código DANE solo puede contener letras y números.'),
];
