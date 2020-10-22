const User = require('../models/user');

module.exports = {
  addEvent,
  removeEvent
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
    console.log(user.events)
    user.events.splice(user.events.findIndex(e => e === req.params.eventId),1);
    console.log(user.events)
    user.save(function(err) {
      res.redirect('/events')
    })
  })
}