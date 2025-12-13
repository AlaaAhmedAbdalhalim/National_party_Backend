
const { DataTypes } = require('sequelize');
/* const sequelize = require('../config/db');
 */
const Events = sequelize.define('Events', {
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    details: DataTypes.TEXT
});

module.exports = Events;

