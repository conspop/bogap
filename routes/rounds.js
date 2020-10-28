var express = require('express');
var router = express.Router();
var roundsCtrl = require('../controllers/rounds');

router.get('/users/:userId/events/:eventId/rounds/:roundId', isLoggedIn, isProfileComplete, roundsCtrl.scorecard)
router.get('/standings', isLoggedIn, isProfileComplete, roundsCtrl.standings)

router.post('/users/:userId/events/:eventId/rounds/new', isLoggedIn, isProfileComplete, roundsCtrl.createRound);

router.put('/users/:userId/events/:eventId/rounds/:roundId/submit', isLoggedIn, isProfileComplete, roundsCtrl.submitScorecard);
router.put('/users/:userId/events/:eventId/rounds/:roundId', isLoggedIn, isProfileComplete, roundsCtrl.updateScorecard);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/');
}

function isProfileComplete(req, res, next) {
  let user = req.user
  console.log(user)
  if (
    user.firstName &&
    user.lastName &&
    user.handicap &&
    user.phone
  ) {
    return next();
  } else {
    res.redirect('/users/complete-profile')
  }
}

module.exports = router;