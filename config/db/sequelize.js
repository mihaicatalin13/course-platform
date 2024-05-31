const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './config/db/database.sqlite'
})

module.exports = sequelize;