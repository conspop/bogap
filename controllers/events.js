const Event = require('../models/event');
const User = require('../models/user');

module.exports = {
  index
};

function index(req, res) {
  Event.find({}).sort('date').exec(function(err, events) {
    User.findById(req.user._id).populate('rounds').exec(function(err, user) {
      res.render('events/index', { events, user });
    });
  });
};