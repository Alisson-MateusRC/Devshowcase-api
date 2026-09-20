const { body } = require('express-validator');

const technologyValidator = [
    body('name')
        .notEmpty()
        .withMessage('O nome da tecnologia é obrigatório')
        .isLength({ min: 2, max: 50 })
        .withMessage('O nome da tecnologia deve ter entre 2 e 50 caracteres')
];

module.exports = technologyValidator;