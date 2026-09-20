const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Technology = sequelize.define('Technology', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Technology;