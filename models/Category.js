const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db/sequelize');

class Category extends Model { }

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'category', timestamps: false });

module.exports = Category;