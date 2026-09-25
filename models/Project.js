const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    url: {
        type: DataTypes.STRING,
        allowNull: false
    },

    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    upvotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Project;