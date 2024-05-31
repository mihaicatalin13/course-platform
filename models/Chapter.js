const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db/sequelize');

class Chapter extends Model { }

Chapter.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'chapter', timestamps: true });

module.exports = Chapter;