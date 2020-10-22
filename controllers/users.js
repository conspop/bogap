const User = require('../models/user');

module.exports = {
  addEvent
};

function addEvent(req, res) {
  User.findById(req.params.userId, function(err, user) {
    user.events.push(req.params.eventId);
    user.save(function(err) {
      res.redirect(`/events`)
    })
  });
};