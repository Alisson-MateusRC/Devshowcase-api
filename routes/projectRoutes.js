const express = require('express');
const { validationResult } = require('express-validator');
const { Project, Profile, Technology } = require('../models');
const projectValidator = require('../validators/projectValidator');
const CreateProjectDTO = require('../dto/input/CreateProjectDTO');
const ProjectOutputDTO = require('../dto/output/ProjectOutputDTO');

const router = express.Router();

// Criar projeto
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

        const projectResponse = new ProjectOutputDTO(project);

        res.status(201).json(projectResponse);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Listar projetos
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    association: 'profile'
                },
                {
                    association: 'technologies'
                },
                {
                    association: 'feedbacks'
                }
            ]
        });

        const projectResponse = projects.map(
            project => new ProjectOutputDTO(project)
        );

        res.json(projectResponse);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;