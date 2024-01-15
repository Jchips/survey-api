'use strict';

const responseModel = (sequelize, DataTypes) => sequelize.define('Response', {
  response: { type: DataTypes.JSON, required: true },
});

module.exports = responseModel;