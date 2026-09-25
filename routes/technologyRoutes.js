const express = require('express');
const { validationResult } = require('express-validator');
const { Technology } = require('../models');
const technologyValidator = require('../validators/technologyValidator');
const CreateTechnologyDTO = require('../dto/input/CreateTechnologyDTO');
const TechnologyOutputDTO = require('../dto/output/TechnologyOutputDTO');

const router = express.Router();

/**
 * @swagger
 * /api/technologies:
 *   post:
 *     summary: Cria uma nova tecnologia
 *     description: Cadastra uma tecnologia que pode ser associada aos projetos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: JavaScript
 *     responses:
 *       201:
 *         description: Tecnologia criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
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

/**
 * @swagger
 * /api/technologies:
 *   get:
 *     summary: Lista as tecnologias
 *     description: Retorna todas as tecnologias cadastradas.
 *     responses:
 *       200:
 *         description: Lista de tecnologias retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
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