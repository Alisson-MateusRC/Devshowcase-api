const express = require('express');
const { validationResult } = require('express-validator');
const { Project, Profile, Technology } = require('../models');
const projectValidator = require('../validators/projectValidator');
const feedbackValidator = require('../validators/feedbackValidator');
const CreateProjectDTO = require('../dto/input/CreateProjectDTO');
const ProjectOutputDTO = require('../dto/output/ProjectOutputDTO');
const FeedbackOutputDTO = require('../dto/output/FeedbackOutputDTO');
const projectService = require('../services/projectService');

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Lista os projetos
 *     description: Lista projetos com filtro por tecnologia e paginação.
 *     parameters:
 *       - in: query
 *         name: technologyId
 *         schema:
 *           type: integer
 *         description: ID da tecnologia para filtrar os projetos.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de projetos por página.
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso.
 *       400:
 *         description: Parâmetros inválidos.
 */
router.get('/', async (req, res) => {
    try {
        const technologyId = req.query.technologyId
            ? Number(req.query.technologyId)
            : undefined;

        const page = req.query.page
            ? Number(req.query.page)
            : 1;

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10;

        if (
            (technologyId !== undefined && !Number.isInteger(technologyId)) ||
            !Number.isInteger(page) ||
            !Number.isInteger(limit)
        ) {
            return res.status(400).json({
                error: 'technologyId, page e limit devem ser números inteiros'
            });
        }

        if (page < 1) {
            return res.status(400).json({
                error: 'A página deve ser maior ou igual a 1'
            });
        }

        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'O limite deve estar entre 1 e 100'
            });
        }

        const result = await projectService.listProjects({
            technologyId,
            page,
            limit
        });

        const projectResponse = result.projects.map(
            project => new ProjectOutputDTO(project)
        );

        res.json({
            projects: projectResponse,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/projects/{id}/upvote:
 *   put:
 *     summary: Adiciona um upvote ao projeto
 *     description: Incrementa a quantidade de upvotes do projeto.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto.
 *     responses:
 *       200:
 *         description: Upvote adicionado com sucesso.
 *       404:
 *         description: Projeto não encontrado.
 */
router.put('/:id/upvote', async (req, res) => {
    try {
        const { id } = req.params;

        const project = await projectService.addUpvote(id);

        const projectResponse = new ProjectOutputDTO(project);

        res.json(projectResponse);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/projects/{id}/feedbacks:
 *   post:
 *     summary: Adiciona um feedback ao projeto
 *     description: Cria um feedback com avaliação de 1 a 5 e atualiza a média de avaliação do projeto.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Projeto muito interessante!
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Projeto não encontrado.
 */
router.post('/:id/feedbacks', feedbackValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        const result = await projectService.createFeedback(
            id,
            comment,
            rating
        );

        const feedbackResponse = new FeedbackOutputDTO(result.feedback);

        res.status(201).json({
            feedback: feedbackResponse,
            averageRating: result.averageRating
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Cria um novo projeto
 *     description: Cria um projeto associado a um perfil e, opcionalmente, a tecnologias.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - profileId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Meu Projeto
 *               description:
 *                 type: string
 *                 example: Projeto desenvolvido para demonstrar conhecimentos em programação.
 *               url:
 *                 type: string
 *                 example: https://github.com/exemplo/projeto
 *               profileId:
 *                 type: integer
 *                 example: 1
 *               technologyIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Perfil ou tecnologia não encontrada.
 */
router.post('/', projectValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const projectData = new CreateProjectDTO(req.body);

        const profile = await Profile.findByPk(projectData.profileId);

        if (!profile) {
            return res.status(404).json({
                error: 'Perfil não encontrado'
            });
        }

        let technologies = [];

        if (projectData.technologyIds) {
            technologies = await Technology.findAll({
                where: {
                    id: projectData.technologyIds
                }
            });

            if (technologies.length !== projectData.technologyIds.length) {
                return res.status(404).json({
                    error: 'Uma ou mais tecnologias não foram encontradas'
                });
            }
        }

        const project = await Project.create({
            title: projectData.title,
            description: projectData.description,
            url: projectData.url,
            profileId: projectData.profileId
        });

        if (technologies.length > 0) {
            await project.setTechnologies(technologies);
        }

        const projectWithRelations = await Project.findByPk(project.id, {
            include: [
                {
                    association: 'technologies'
                },
                {
                    association: 'feedbacks'
                }
            ]
        });

        const projectResponse = new ProjectOutputDTO(projectWithRelations);

        res.status(201).json(projectResponse);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;