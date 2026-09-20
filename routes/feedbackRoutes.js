const express = require('express');
const { validationResult } = require('express-validator');
const { Feedback, Project } = require('../models');
const feedbackValidator = require('../validators/feedbackValidator');
const CreateFeedbackDTO = require('../dto/input/CreateFeedbackDTO');
const FeedbackOutputDTO = require('../dto/output/FeedbackOutputDTO');

const router = express.Router();

// Criar feedback
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

// Listar feedbacks
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