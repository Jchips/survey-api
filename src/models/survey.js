'use strict';

const surveyModel = (sequelize, DataTypes) => {
  return sequelize.define('Survey', {
    title: {type: DataTypes.STRING, required: true},
    questions: {type: DataTypes.JSON, required: true},
  });
};

module.exports = surveyModel;