'use strict';
const { Survey } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    let survey = await Survey.findOne({ where: { id: req.params.survey_id } });
    if (req.user.id === survey.created_by_user_id && req.user.id === parseInt(req.params.userId)) {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  } catch (err) {
    next(err);
  }
};