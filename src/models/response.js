'use strict';

const responseModel = (sequelize, DataTypes) => sequelize.define('Response', {
  response: { type: DataTypes.ARRAY(DataTypes.STRING), required: true },
});

module.exports = responseModel;