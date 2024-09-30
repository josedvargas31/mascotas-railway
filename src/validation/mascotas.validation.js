import { check } from 'express-validator';

// Validaciones para la creación de mascotas
export const validateCrearMascota = [
    check('nombre_mascota', 'El nombre de la mascota es obligatorio y debe ser una cadena de texto.')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max: 50 }).withMessage('El nombre de la mascota no puede exceder los 50 caracteres.'),
    
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria y debe ser una fecha válida.')
        .not()
        .isEmpty()
        .isDate().withMessage('La fecha de nacimiento debe ser una fecha válida.'),

    check('estado', 'El estado de la mascota es obligatorio y debe ser uno de los valores permitidos.')
        .not()
        .isEmpty()
        .isIn(['En Adopcion', 'Urgente', 'Adoptado', 'Reservado']).withMessage('El estado de la mascota debe ser uno de los siguientes: En Adopcion, Urgente, Adoptado, Reservado.'),

    check('descripcion', 'La descripción de la mascota debe ser una cadena de texto de máximo 300 caracteres.')
        .optional()
        .isString()
        .isLength({ max: 300 }).withMessage('La descripción de la mascota no puede exceder los 300 caracteres.'),
    
    check('esterilizado', 'El estado de esterilización es obligatorio y debe ser uno de los valores permitidos.')
        .not()
        .isEmpty()
        .isIn(['si', 'no']).withMessage('El estado de esterilización debe ser "si" o "no".'),

    check('tamano', 'El tamaño de la mascota es obligatorio y debe ser uno de los valores permitidos.')
        .not()
        .isEmpty()
        .isIn(['Pequeno', 'Mediano', 'Intermedio', 'Grande']).withMessage('El tamaño de la mascota debe ser uno de los siguientes: Pequeno, Mediano, Intermedio, Grande.'),

    check('peso', 'El peso de la mascota es obligatorio y debe ser un número decimal válido.')
        .not()
        .isEmpty()
        .isDecimal({ decimal_digits: '2' }).withMessage('El peso de la mascota debe ser un número decimal con hasta 2 dígitos después del punto.'),
    
    check('fk_id_categoria', 'El ID de la categoría debe ser un número entero válido.')
        .optional()
        .isInt().withMessage('El ID de la categoría debe ser un número entero.'),
    
    check('fk_id_raza', 'El ID de la raza debe ser un número entero válido.')
        .optional()
        .isInt().withMessage('El ID de la raza debe ser un número entero.'),
    
    check('fk_id_departamento', 'El ID del departamento debe ser un número entero válido.')
        .optional()
        .isInt().withMessage('El ID del departamento debe ser un número entero.'),
    
    check('fk_id_municipio', 'El ID del municipio debe ser un número entero válido.')
        .optional()
        .isInt().withMessage('El ID del municipio debe ser un número entero.'),
    
    check('sexo', 'El sexo de la mascota es obligatorio y debe ser uno de los valores permitidos.')
        .not()
        .isEmpty()
        .isIn(['Macho', 'Hembra']).withMessage('El sexo de la mascota debe ser "Macho" o "Hembra".'),
];

// Validaciones para la actualización de mascotas
export const validateActualizarMascota = [
    check('nombre_mascota')
        .optional()
        .isString()
        .isLength({ max: 50 }).withMessage('El nombre de la mascota no puede exceder los 50 caracteres.'),
    
    check('fecha_nacimiento')
        .optional()
        .isDate().withMessage('La fecha de nacimiento debe ser una fecha válida.'),

    check('estado')
        .optional()
        .isIn(['En Adopcion', 'Urgente', 'Adoptado', 'Reservado']).withMessage('El estado de la mascota debe ser uno de los siguientes: En Adopcion, Urgente, Adoptado, Reservado.'),

    check('descripcion')
        .optional()
        .isString()
        .isLength({ max: 300 }).withMessage('La descripción de la mascota no puede exceder los 300 caracteres.'),
    
    check('esterilizado')
        .optional()
        .isIn(['si', 'no']).withMessage('El estado de esterilización debe ser "si" o "no".'),

    check('tamano')
        .optional()
        .isIn(['Pequeno', 'Mediano', 'Intermedio', 'Grande']).withMessage('El tamaño de la mascota debe ser uno de los siguientes: Pequeno, Mediano, Intermedio, Grande.'),

    check('peso')
        .optional()
        .isDecimal({ decimal_digits: '2' }).withMessage('El peso de la mascota debe ser un número decimal con hasta 2 dígitos después del punto.'),
    
    check('fk_id_categoria')
        .optional()
        .isInt().withMessage('El ID de la categoría debe ser un número entero.'),
    
    check('fk_id_raza')
        .optional()
        .isInt().withMessage('El ID de la raza debe ser un número entero.'),
    
    check('fk_id_departamento')
        .optional()
        .isInt().withMessage('El ID del departamento debe ser un número entero.'),
    
    check('fk_id_municipio')
        .optional()
        .isInt().withMessage('El ID del municipio debe ser un número entero.'),
    
    check('sexo')
        .optional()
        .isIn(['Macho', 'Hembra']).withMessage('El sexo de la mascota debe ser "Macho" o "Hembra".'),
];
