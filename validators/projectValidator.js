const { body } = require('express-validator');

const projectValidator = [
    body('title')
        .notEmpty()
        .withMessage('O título do projeto é obrigatório'),

    body('description')
        .notEmpty()
        .withMessage('A descrição do projeto é obrigatória'),

    body('url')
        .notEmpty()
        .withMessage('A URL do projeto é obrigatória')
        .isURL()
        .withMessage('Informe uma URL válida'),

    body('profileId')
        .notEmpty()
        .withMessage('O profileId é obrigatório')
        .isInt()
        .withMessage('O profileId deve ser um número inteiro'),

    body('technologyIds')
        .optional()
        .isArray()
        .withMessage('technologyIds deve ser uma lista'),

    body('technologyIds.*')
        .optional()
        .isInt()
        .withMessage('Cada technologyId deve ser um número inteiro')
];

module.exports = projectValidator;