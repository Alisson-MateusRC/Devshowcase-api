const express = require('express');
const { validationResult } = require('express-validator');
const { Profile } = require('../models');
const profileValidator = require('../validators/profileValidator');
const CreateProfileDTO = require('../dto/input/CreateProfileDTO');
const ProfileOutputDTO = require('../dto/output/ProfileOutputDTO');

const router = express.Router();

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Cria um novo perfil
 *     description: Cria um perfil de desenvolvedor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bio
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               bio:
 *                 type: string
 *                 example: Estudante de Tecnologia em Sistemas para Internet
 *     responses:
 *       201:
 *         description: Perfil criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', profileValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const profileData = new CreateProfileDTO(req.body);

        const profile = await Profile.create(profileData);

        const profileResponse = new ProfileOutputDTO(profile);

        res.status(201).json(profileResponse);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/profiles/{id}:
 *   get:
 *     summary: Busca um perfil por ID
 *     description: Retorna um perfil de desenvolvedor e seus projetos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil.
 *     responses:
 *       200:
 *         description: Perfil encontrado com sucesso.
 *       404:
 *         description: Perfil não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await Profile.findByPk(id, {
            include: [
                {
                    association: 'projects'
                }
            ]
        });

        if (!profile) {
            return res.status(404).json({
                error: 'Perfil não encontrado'
            });
        }

        const profileResponse = new ProfileOutputDTO(profile);

        res.json(profileResponse);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;