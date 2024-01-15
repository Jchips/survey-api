'use strict';

const base64 = require('base-64');
const { User } = require('../models');

/**
 * Middleware that authenticates a user using basic auth.
 * If the user is authenticated, it stores the user (object) in req.user
 * Otherwise, it gives an error.
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function in the stack.
 */
// const basicAuth = async (req, res, next) => {
async function basicAuth(req, res, next) {
  if (!req.headers.authorization) {
    next('Invalid login');
  }
  let basic = req.headers.authorization.split(' '); // [ 'Basic', 'am9objpmb28=' ]
  let encodedLogin = basic.pop(); // 'am9objpmb28='
  let decodedLogin = base64.decode(encodedLogin); // "username:password"
  let [username, password] = decodedLogin.split(':');
  try {
    let user = await User.basicAuthentication(username, password);
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(403).send('Invalid login');
  }
}

module.exports = basicAuth;