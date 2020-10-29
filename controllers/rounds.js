const Round = require('../models/round');
const User = require('../models/user');
const Event = require('../models/event');

module.exports = {
  createRound,
  scorecard,
  updateScorecard,
  standings,
  submitScorecard
};

function createRound(req, res) {
  User.findById(req.params.userId).exec(function(err, user) {
    let newRound = new Round({
      event: req.params.eventId,
      handicap: user.handicap,
      grossScore: null,
      netScore: null,
      scores:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] 
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
  Round.findById(req.params.roundId).populate('event').exec(function(err, round) {
    User.find({}).populate('rounds').exec(function(err, users) {
      //determine currentHole
      let currentHole
      if (round.scores.includes(null)) {
        currentHole = round.scores.findIndex(s => s === null);
      } else {
        currentHole = 'submit'
      }
      //create scores array
      let scores = round.scores.map(s => {
        if (s === null) {
          return ''
        } else {
          return s
        }
      })
      //create pars array
      let pars = round.event.coursePars.map(p => {
        return p
      })
      //create plusMinus array
      let runningTotal = 0
      let plusMinus = []
      for (let i = 0; i < 18; i++) {
        if (scores[i] === '') {
          console.log('top')
          plusMinus.push('')
        } else {
          let holePlusMinus = parseInt(scores[i]) - parseInt(pars[i])
          runningTotal += holePlusMinus
          plusMinus.push(runningTotal)
        }
      }
      //create leaderboard array
      let eventId = req.params.eventId
      let leaderboard = []
      users.forEach(u => u.rounds.forEach(r => {
        console.log(r.event, eventId)
        if (r.event.equals(eventId)) {
          let currentHole
          if (r.scores.includes(null)) {
            currentHole = r.scores.findIndex(s => s === null);
          } else {
            currentHole = '18'
          }
          let plusMinus = 0
          for (let i = 0; i < 18; i++) {
            if (r.scores[i] === null) {
              break;
            } else {
              plusMinus += (parseInt(r.scores[i]) - parseInt(pars[i]))
            }
          }
          leaderboard.push([u.firstName, plusMinus, currentHole]);
        }
      }))
      leaderboard.sort((a, b) => a[1] - b[1])
      res.render('rounds/scorecard', { user:req.user, plusMinus, scores, pars, round, currentHole, leaderboard });
    });     
  }); 
}

function updateScorecard(req, res) {
  Round.findById(req.params.roundId, function(err, round) {
    console.log('got here')
    console.log(req.body.currentHoleId)
    console.log(req.body.score)
    round.scores.set(req.body.currentHoleId, req.body.score.toString())
    console.log(round.scores)
    console.log(round)
    round.save(function(err) {
      console.log(err)
      res.redirect(`/users/${req.params.userId}/events/${req.params.eventId}/rounds/${req.params.roundId}`);
    });
  });
}

function submitScorecard(req, res) {
  Round.findById(req.params.roundId).populate('event').exec(function(err, round) {
    let grossScore = round.scores.reduce((sum, s) => sum + parseInt(s), 0)
    let netScore = grossScore - Math.round((round.handicap * round.event.courseSlope / 113)) 
    round.grossScore = grossScore
    round.netScore = netScore
    round.save(function(err) {
      res.redirect(`/events`)
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
        console.log(u.rounds)
        if (u.rounds.length > 0) {
          userClasses.push('')
          events.forEach(e => {
            let roundScore = u.rounds.find(r => r.event.equals(e._id))
            if (roundScore) {
              if (roundScore.netScore === undefined || roundScore.netScore === null) {
                userValues.push('-')
              } else {
                userValues.push(roundScore.netScore)
                userScores.push(roundScore.netScore)
              }
            } else {
              userValues.push('-')
            }
          })
          let numScores = (userScores.length < 5) ? userScores.length : 4;
          let bestFour = (userScores.slice().sort().slice(0,4).reduce((sum, v) => sum + v,0) / numScores).toFixed(2)
          userValues.push(bestFour)
          // sort by best 4
          userValues.unshift(u.firstName)
          valuesArray.push(userValues)
          classesArray.push(userClasses)
        }
      })
      valuesArray.sort((a,b) => b[b.length - 1] - a[a.length - 1] )
      res.render('rounds/standings', { user: req.user, valuesArray, classesArray});
    });  
  });
}

