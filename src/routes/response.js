'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Response } = require('../models');

const router = express.Router();

// Routes
router.get('/responses/:survey_id', bearerAuth, acl('viewResponse'), handleGetAll);
router.post('/responses', bearerAuth, acl('createResponse'), handleCreate);

// Handlers
async function handleGetAll(req, res, next) {
  let { survey_id } = req.params;
  try {
    let allResponses = await Response.findAll({ where: { survey_id }});
    res.status(200).json(allResponses);
  } catch (err) {
    next(err);
  }
}

async function handleCreate(req, res, next) {
  let userResponse = req.body;
  try {
    let response = await Response.create(userResponse);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = router;