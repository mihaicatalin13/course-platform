const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db/sequelize');

class User extends Model { }

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING
    }
}, { sequelize, modelName: 'user', timestamps: false });

module.exports = User;