const Round = require('../models/round');
const User = require('../models/user');
const Event = require('../models/event');

module.exports = {
  createRound,
  scorecard,
  updateScorecard
};

function createRound(req, res) {
  User.findById(req.params.userId).exec(function(err, user) {
    let newRound = new Round({
      event: req.params.eventId,
      handicap: user.handicap,
      scores:[] 
    });
    newRound.save(function(err, newRound) {
      user.rounds.push(newRound._id)
      user.save(function(err) {
        res.redirect(`/users/${user._id}/events/${req.params.eventId}/rounds/${newRound._id}`);
      });
    });
  });
};

function scorecard(req, res) {
  User.findById(req.params.userId, function(err, user) {
    Event.findById(req.params.eventId, function(err, event) {
      Round.findById(req.params.roundId, function(err, round) {
        res.render('rounds/scorecard', { user:req.user, event, round });
      });
    });  
  });
}

function updateScorecard(req, res) {
  Round.findById(req.params.roundId, function(err, round) {
    let newScores = new Array(18)
    for (let i = 0; i < 18; i++) {
      newScores[i] = (req.body[`score${i}`]) ? req.body[`score${i}`] : null
    }
    round.scores = newScores
    round.save(function(err) {
      res.redirect(`/users/${req.params.userId}/events/${req.params.eventId}/rounds/${req.params.roundId}`);
    });
  });
}

