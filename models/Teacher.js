const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db/sequelize');

class Teacher extends Model { }

Teacher.init({
    expertiseDocument: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { sequelize, modelName: 'teacher', timestamps: false });

module.exports = Teacher;