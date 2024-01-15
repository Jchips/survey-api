'use strict';

const { db } = require('./src/auth/models');
const { start } = require('./src/server');

db.sync()
  .then(() => console.log('database is running'))
  .then(() => start());