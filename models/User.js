// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    userType: {
        type: DataTypes.ENUM('admin-master', 'user-master', 'admin', 'user'),
        allowNull: false
    },
    companyId: { type: DataTypes.INTEGER, allowNull: true } // ID da empresa, caso seja admin ou user
});

// Define o relacionamento
User.associate = (models) => {
    User.belongsTo(models.Company, { foreignKey: 'companyId' });
};

module.exports = User;
