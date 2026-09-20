const express = require('express');
const { validationResult } = require('express-validator');
const { Technology } = require('../models');
const technologyValidator = require('../validators/technologyValidator');
const CreateTechnologyDTO = require('../dto/input/CreateTechnologyDTO');
const TechnologyOutputDTO = require('../dto/output/TechnologyOutputDTO');

const router = express.Router();

// Criar tecnologia
router.post('/', technologyValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const technologyData = new CreateTechnologyDTO(req.body);

        const technology = await Technology.create(technologyData);

        const technologyResponse = new TechnologyOutputDTO(technology);

        res.status(201).json(technologyResponse);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Listar tecnologias
router.get('/', async (req, res) => {
    try {
        const technologies = await Technology.findAll();

        const technologyResponse = technologies.map(
            technology => new TechnologyOutputDTO(technology)
        );

        res.json(technologyResponse);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;