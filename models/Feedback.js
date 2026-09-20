const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Feedback;