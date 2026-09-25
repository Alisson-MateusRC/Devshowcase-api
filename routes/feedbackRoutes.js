const express = require('express');
const { validationResult } = require('express-validator');
const { Feedback, Project } = require('../models');
const feedbackValidator = require('../validators/feedbackValidator');
const CreateFeedbackDTO = require('../dto/input/CreateFeedbackDTO');
const FeedbackOutputDTO = require('../dto/output/FeedbackOutputDTO');

const router = express.Router();

/**
 * @swagger
 * /api/feedbacks:
 *   post:
 *     summary: Cria um novo feedback
 *     description: Cria um feedback associado a um projeto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *               - projectId
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Projeto muito interessante!
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               projectId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Projeto não encontrado.
 */
router.post('/', feedbackValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const feedbackData = new CreateFeedbackDTO(req.body);

        const project = await Project.findByPk(feedbackData.projectId);

        if (!project) {
            return res.status(404).json({
                error: 'Projeto não encontrado'
            });
        }

        const feedback = await Feedback.create(feedbackData);

        const feedbackResponse = new FeedbackOutputDTO(feedback);

        res.status(201).json(feedbackResponse);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Lista os feedbacks
 *     description: Retorna todos os feedbacks cadastrados.
 *     responses:
 *       200:
 *         description: Lista de feedbacks retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();

        const feedbackResponse = feedbacks.map(
            feedback => new FeedbackOutputDTO(feedback)
        );

        res.json(feedbackResponse);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;