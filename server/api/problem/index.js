'use strict';

var express = require('express');
var controller = require('./problem.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/next', auth.isAuthenticated(), controller.next);

router.post('/:id/answer', auth.isAuthenticated(), controller.answer);
router.post('/:id/comment', auth.isAuthenticated(), controller.comment);

module.exports = router;
