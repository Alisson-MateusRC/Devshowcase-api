const { body } = require('express-validator');

const feedbackValidator = [
    body('comment')
        .notEmpty()
        .withMessage('O comentário é obrigatório'),

    body('rating')
        .notEmpty()
        .withMessage('A avaliação é obrigatória')
        .isInt({ min: 1, max: 5 })
        .withMessage('A avaliação deve ser um número entre 1 e 5')
];

module.exports = feedbackValidator;