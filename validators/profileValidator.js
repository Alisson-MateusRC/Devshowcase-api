const { body } = require('express-validator');

const profileValidator = [
    body('name')
        .notEmpty()
        .withMessage('O nome é obrigatório'),

    body('email')
        .notEmpty()
        .withMessage('O e-mail é obrigatório')
        .isEmail()
        .withMessage('Informe um e-mail válido'),

    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('A bio deve ter no máximo 500 caracteres')
];

module.exports = profileValidator;