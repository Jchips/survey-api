'use strict';
const { Survey } = require('../../models');

/**
 * Checks to make sure the survey a user is trying to access is one that they created.
 * Either goes to next function stack or sends an error depending on whether the above is true
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function in the stack.
 */
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