var express = require('express');
var router = express.Router();
var eventsCtrl = require('../controllers/events')

router.get('/', isLoggedIn, eventsCtrl.index);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/');
}

module.exports = router;