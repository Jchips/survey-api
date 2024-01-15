'use strict';
require('dotenv').config();
const { Sequelize, DataTypes} = require('sequelize');
const userModel = require('./user');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL);
const User = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  User,
};