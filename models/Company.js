// models/Company.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Company = sequelize.define('Company', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isMaster: { type: DataTypes.BOOLEAN, defaultValue: false } // Campo para indicar se é a empresa master
});

module.exports = Company;
