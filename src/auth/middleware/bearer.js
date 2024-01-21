'use strict';

const { User } = require('../models');

/**
 * Middleware that authenticates a user using bearer auth.
 * If the user is authenticated, it stores the user (object) in req.user
 * and stores the user's token in req.token
 * Otherwise, it gives an error.
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function in the stack.
 */
const bearerAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid login');
  }
  const token = req.headers.authorization.split(' ').pop(); // stores token
  try {
    let user = await User.bearerAuthentication(token);
    req.user = user;
    req.token = user.token;
    next();
  } catch (err) {
    console.error(err.message);
    next('Invalid login');
  }
};

module.exports = bearerAuth;