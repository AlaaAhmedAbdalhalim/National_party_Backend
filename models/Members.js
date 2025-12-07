
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Members = sequelize.define('Members', {
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    image: DataTypes.STRING
});

module.exports = Members;
