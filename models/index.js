const Profile = require('./Profile');
const Project = require('./Project');
const Technology = require('./Technology');
const Feedback = require('./Feedback');

Profile.hasMany(Project, {
    foreignKey: 'profileId',
    as: 'projects'
});

Project.belongsTo(Profile, {
    foreignKey: 'profileId',
    as: 'profile'
});

Project.belongsToMany(Technology, {
    through: 'ProjectTechnologies',
    foreignKey: 'projectId',
    otherKey: 'technologyId',
    as: 'technologies'
});

Technology.belongsToMany(Project, {
    through: 'ProjectTechnologies',
    foreignKey: 'technologyId',
    otherKey: 'projectId',
    as: 'projects'
});

Project.hasMany(Feedback, {
    foreignKey: 'projectId',
    as: 'feedbacks'
});

Feedback.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

module.exports = {
    Profile,
    Project,
    Technology,
    Feedback
};