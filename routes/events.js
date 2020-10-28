var express = require('express');
var router = express.Router();
var eventsCtrl = require('../controllers/events')

router.get('/', isLoggedIn, isProfileComplete, eventsCtrl.index);

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