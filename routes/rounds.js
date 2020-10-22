var express = require('express');
var router = express.Router();
var roundsCtrl = require('../controllers/rounds');
const round = require('../models/round');

router.get('/users/:userId/events/:eventId/rounds/:roundId', isLoggedIn, roundsCtrl.scorecard)

router.post('/users/:userId/events/:eventId/rounds/new', isLoggedIn, roundsCtrl.createRound);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/');
}

module.exports = router;