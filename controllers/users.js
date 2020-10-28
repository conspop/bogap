const User = require('../models/user');

module.exports = {
  addEvent,
  removeEvent,
  addEventAjax,
  removeEventAjax,
  completeProfile  
};

function addEvent(req, res) {
  User.findById(req.params.userId, function(err, user) {
    user.events.push(req.params.eventId);
    user.save(function(err) {
      res.redirect(`/events`)
    })
  });
};

function removeEvent(req, res) {
  User.findById(req.params.userId, function(err, user) {
    user.events.splice(user.events.findIndex(e => e === req.params.eventId),1);
    user.save(function(err) {
      res.redirect('/events')
    })
  })
}

function addEventAjax(req, res) {
  User.findById(req.body.userId, function(err, user) {
    user.events.push(req.body.eventId);
    user.save(function(err) {
      res.json('ok!')
    })
  });
};

function removeEventAjax(req, res) {
  User.findById(req.body.userId, function(err, user) {
    user.events.splice(user.events.findIndex(e => e === req.body.eventId),1);
    user.save(function(err) {
      res.json('ok!')
    })
  })
}

function completeProfile(req, res) {
  User.findById(req.params.userId, function(err, user) {
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.handicap = req.body.handicap
    user.phone = req.body.phone
    user.save(function(err) {
      res.redirect(`/events`)
    })
  });
}