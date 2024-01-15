'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, required: true },
    password: { type: DataTypes.STRING, required: true },
    role: { type: DataTypes.ENUM('user', 'creator', 'admin'), required: true, defaultValue: 'user' },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read', 'createResponse'],
          creator: ['read', 'viewResponse', 'createResponse', 'createSurvey', 'updateSurvey', 'deleteSurvey'],
          admin: ['read', 'viewResponse', 'createResponse', 'createSurvey', 'updateSurvey', 'deleteSurvey', 'deleteUser'],
        };
        return acl[this.role];
      },
    },
  });

  // Hashes the user's password before adding them to the database
  model.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  /**
 * Checks if the given password is the same as the password stored in the database.
 * If so, it returns the user (object)
 * @param {string} username - the username the user entered
 * @param {string} password - the password the user entered
 * @returns {Object} - the user
 */
  model.basicAuthentication = async function (username, password) {
    try {
      let user = await this.findOne({ where: { username } });
      const validate = await bcrypt.compare(password, user.password);
      if (validate) {
        return user;
      }
      throw new Error('Invalid login');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  /**
   * Verifies the given token to authenticate user.
   * If the token is verified, sends back the user.
   * If the token is not verified, sends an error.
   * @param {string} token - A jwt
   * @returns {Object} - the user
   */
  model.bearerAuthentication = async function (token) {
    try {
      const decodedPayload = jwt.verify(token, SECRET);
      let user = await this.findOne({ where: { username: decodedPayload.username } });
      if (user) {
        return user;
      }
      throw new Error('Invalid login');
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return model;
};

module.exports = userModel;