'use strict';

const { db } = require('../auth/models');
const { DataTypes } = require('sequelize');
const responseModel = require('./response');
const surveyModel = require('./survey');

const Response = responseModel(db, DataTypes);
const Survey = surveyModel(db, DataTypes);

// One-to-many relation
Survey.hasOne(Response, { foreignKey: 'survey_id', as: 'responses' });
Response.belongsTo(Survey, { foreignKey: 'survey_id' });


module.exports = {
  Response,
  Survey,
};