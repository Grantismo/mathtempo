'use strict';

var express = require('express');
var controller = require('./problem.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/next', auth.isAuthenticated(), controller.nextProblem);
router.get('/:id', auth.isAuthenticated(), controller.show);

router.post('/:id/answer', auth.isAuthenticated(), controller.answer);
router.post('/:id/comment', auth.isAuthenticated(), controller.comment);

module.exports = router;
