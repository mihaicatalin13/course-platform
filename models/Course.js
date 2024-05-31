const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db/sequelize');

class Course extends Model { }

Course.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prerequisites: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { sequelize, modelName: 'course', timestamps: true });

module.exports = Course;

