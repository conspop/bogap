const Round = require('../models/round');
const User = require('../models/user');
const Event = require('../models/event');

module.exports = {
  createRound,
  scorecard,
  updateScorecard,
  standings
};

function createRound(req, res) {
  User.findById(req.params.userId).exec(function(err, user) {
    let newRound = new Round({
      event: req.params.eventId,
      handicap: user.handicap,
      grossScore: null,
      netScore: null,
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

function standings(req, res) {
  User.find({}).populate('rounds').exec(function(err, users) {
    Event.find({}).sort('date').exec(function(err, events) {
      let valuesArray = []
      let classesArray = []
      //header row
      let headerValues = ['Name']
      events.forEach(e => headerValues.push(e.courseNameShort))
      headerValues.push('Best 4')
      valuesArray.push(headerValues)
      classesArray.push([])
      //user rows
      users.forEach(u => {
        //eliminate users with no submitted rounds
        let userValues = []
        let userClasses = []
        let userScores = []
        if (u.events) {
          userClasses.push('')
          events.forEach(e => {
            let roundScore = u.rounds.find(r => r.event.equals(e._id))
            if (roundScore) {
              if (roundScore.netScore === undefined) {
                userValues.push('-')
              } else {
                userValues.push(roundScore.netScore)
                userScores.push(roundScore.netScore)
              }
            } else {
              userValues.push('-')
            }
          })
          let bestFour = (userScores.slice().sort().slice(0,4).reduce((sum, v) => sum + v,0) / 4).toFixed(2)
          userValues.push(bestFour)
          userValues.unshift(u.firstName)
          valuesArray.push(userValues)
          classesArray.push(userClasses)
        }
      })
      res.render('rounds/standings', { user: req.user, valuesArray, classesArray});
    });  
  });
}

