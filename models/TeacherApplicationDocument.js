const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db/sequelize');

class TeacherApplicationDocument extends Model { }

TeacherApplicationDocument.init({
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status : {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'TeacherApplicationDocument', timestamps: true });

module.exports = TeacherApplicationDocument;