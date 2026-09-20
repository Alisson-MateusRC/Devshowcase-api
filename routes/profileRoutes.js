const express = require('express');
const { validationResult } = require('express-validator');
const { Profile } = require('../models');
const profileValidator = require('../validators/profileValidator');
const CreateProfileDTO = require('../dto/input/CreateProfileDTO');
const ProfileOutputDTO = require('../dto/output/ProfileOutputDTO');

const router = express.Router();

// Criar perfil
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

// Buscar perfil por ID
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