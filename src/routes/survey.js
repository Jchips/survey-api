'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Survey } = require('../models');

const router = express.Router();

// Routers
router.get('/surveys', bearerAuth, acl('read'), handleGetAll);
router.get('/surveys/:id', bearerAuth, acl('read'), handleGetOne);
router.post('/surveys', bearerAuth, acl('createSurvey'), handleCreate);
router.put('/surveys/:id', bearerAuth, acl('updateSurvey'), handleUpdate);
router.delete('/surveys/:id', bearerAuth, acl('deleteSurvey'), handleDelete);

// Handlers
async function handleGetAll(req, res, next) {
  try {
    let allSurveys = await Survey.findAll();
    res.status(200).json(allSurveys);
  } catch (err) {
    next(err);
  }
}

async function handleGetOne(req, res, next) {
  let { id } = req.params;
  try {
    let survey = await Survey.findOne({ where: { id } });
    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
}

async function handleCreate(req, res, next) {
  let newSurvey = req.body;
  try {
    let addedSurvey = await Survey.create(newSurvey);
    res.status(201).json(addedSurvey);
  } catch (err) {
    next(err);
  }
}

async function handleUpdate(req, res, next) {
  let { id } = req.params;
  let newEdits = req.body;
  try {
    let editedSurvey = await Survey.update(newEdits, { where: { id }, returning: true, plain: true });
    res.status(200).json(editedSurvey);
  } catch (err) {
    next(err);
  }
}

async function handleDelete(req, res, next) {
  let { id } = req.params;
  try {
    await Survey.destroy({ where: { id } });
    res.status(200).send('deleted survey');
  } catch (err) {
    next(err);
  }
}

module.exports = router;