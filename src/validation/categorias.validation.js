import { check } from 'express-validator';

// Validaciones para la creación de categorías
export const validateCrearCategoria = [
    check('nombre_categoria', 'El nombre de la categoría es obligatorio y debe ser una cadena de texto')
        .not()
        .isEmpty()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre de la categoría solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre de la categoría no puede exceder los 50 caracteres.'),
    
    check('estado', 'El estado es obligatorio y debe ser uno de los siguientes valores: activa, inactiva')
        .not()
        .isEmpty()
        .isIn(['activa', 'inactiva']),
];

// Validaciones para la actualización de categorías
export const validateActualizarCategoria = [
    check('nombre_categoria')
        .optional()
        .isString()
        .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre de la categoría solo puede contener letras y espacios.')
        .isLength({ max: 50 }).withMessage('El nombre de la categoría no puede exceder los 50 caracteres.'),
    
    check('estado')
        .optional()
        .isIn(['activa', 'inactiva']),
];
