'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const checkUid = require('../auth/middleware/check');
const { Survey } = require('../models');

const router = express.Router();

// ------ Routes -----

router.get('/', bearerAuth, acl('read'), handleGetAll);
router.get('/:survey_id', bearerAuth, acl('read'), handleGetOne);
router.post('/', bearerAuth, acl('createSurvey'), handleCreate);
router.put('/:survey_id', bearerAuth, acl('updateSurvey'), checkUid, handleUpdate);
router.delete('/:survey_id', bearerAuth, acl('deleteSurvey'), checkUid, handleDelete);

// ------ Handlers -----

// Gets all surveys in database
// Query parameter for user ID (uid) to get all surveys from a specific user
// Sends object with all surveys found
async function handleGetAll(req, res, next) {
  try {
    let queryObj = {};
    if (req.query.uid) {
      queryObj = { where: { created_by_user_id: req.query.uid } };
    }
    let allSurveys = await Survey.findAll(queryObj);
    res.status(200).json(allSurveys);
  } catch (err) {
    next(err);
  }
}

// Gets a specific survey specified by its id
// Sends object with survey
async function handleGetOne(req, res, next) {
  let { survey_id } = req.params;
  try {
    let survey = await Survey.findOne({ where: { id: survey_id } });
    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
}

// Creates a new survey
// Sends object with newly created survey
async function handleCreate(req, res, next) {
  let newSurvey = req.body;
  try {
    let addedSurvey = await Survey.create(newSurvey);
    res.status(201).json(addedSurvey);
  } catch (err) {
    next(err);
  }
}

// Edits a survey
// Sends object with newly updated survey
async function handleUpdate(req, res, next) {
  let { survey_id } = req.params;
  let newEdits = req.body;
  try {
    // let editedSurvey = await Survey.update(newEdits, { where: { id }, returning: true, plain: true });
    let survey = await Survey.findOne({ where: { id: survey_id } });
    let editedSurvey = await survey.update(newEdits);
    res.status(200).json(editedSurvey);
  } catch (err) {
    next(err);
  }
}

// Deletes a survey
// Sends message saying 'deleted survey'
async function handleDelete(req, res, next) {
  let { survey_id } = req.params;
  try {
    await Survey.destroy({ where: { id: survey_id } });
    res.status(200).send('deleted survey');
  } catch (err) {
    next(err);
  }
}

module.exports = router;