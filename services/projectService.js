const { Project, Technology, Feedback } = require('../models');

async function createFeedback(projectId, comment, rating) {
    const project = await Project.findByPk(projectId);

    if (!project) {
        const error = new Error('Projeto não encontrado');
        error.status = 404;
        throw error;
    }

    const feedback = await Feedback.create({
        comment,
        rating,
        projectId
    });

    const feedbacks = await Feedback.findAll({
        where: {
            projectId
        }
    });

    const totalRating = feedbacks.reduce(
        (sum, item) => sum + item.rating,
        0
    );

    const averageRating = totalRating / feedbacks.length;

    await project.update({
        averageRating
    });

    return {
        feedback,
        averageRating
    };
}

async function addUpvote(projectId) {
    const project = await Project.findByPk(projectId);

    if (!project) {
        const error = new Error('Projeto não encontrado');
        error.status = 404;
        throw error;
    }

    project.upvotes += 1;

    await project.save();

    return project;
}

async function listProjects({ technologyId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const where = {};

    const include = [
        {
            association: 'profile'
        },
        {
            association: 'technologies'
        },
        {
            association: 'feedbacks'
        }
    ];

    if (technologyId) {
        include[1].where = {
            id: technologyId
        };
    }

    const result = await Project.findAndCountAll({
        where,
        include,
        distinct: true,
        limit,
        offset,
        order: [['id', 'ASC']]
    });

    return {
        projects: result.rows,
        total: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit)
    };
}

module.exports = {
    createFeedback,
    addUpvote,
    listProjects
};