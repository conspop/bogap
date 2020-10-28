var express = require('express');
var router = express.Router();
var passport = require('passport')
var usersCtrl = require('../controllers/users')

router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/events',
    failureRedirect : '/events'
  }
));

router.get('/complete-profile', function(req, res, next) {
  res.render('users/complete-profile', {user: req.user})
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/events');
});

router.post('/:userId/events/:eventId/ajax', usersCtrl.addEventAjax)
router.post('/:userId/events/:eventId', usersCtrl.addEvent)

router.put('/users/:userId', usersCtrl.completeProfile)

router.delete('/:userId/events/:eventId/ajax', usersCtrl.removeEventAjax)
router.delete('/:userId/events/:eventId', usersCtrl.removeEvent)

module.exports = router;
