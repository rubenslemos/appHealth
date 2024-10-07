// database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
});

module.exports = sequelize;
