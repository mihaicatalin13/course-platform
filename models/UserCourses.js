const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db/sequelize');
const User = require('./User');
const Course = require('./Course');

class UserCourses extends Model { }

UserCourses.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    }
}, { sequelize, modelName: 'UserCourses', timestamps: true });

module.exports = UserCourses;