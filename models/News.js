
backend/models/News.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const News = sequelize.define('News', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    image: DataTypes.STRING
});

module.exports = News;

