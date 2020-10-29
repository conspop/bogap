const Event = require('../models/event');
const User = require('../models/user');
const Round = require('../models/round');
const { all } = require('../routes/events');

module.exports = {
  index
};

function index(req, res) {
  User.find({}).populate('rounds').exec(function(err, allUsers){
    Event.find({}).sort('date').exec(function(err, events) {
      User.findById(req.user._id).populate('rounds').exec(function(err, user) {
        let committed = getCommitted(allUsers, user);
        let recorded = getRecorded(allUsers, events);
        let utcDate = new Date()
        res.render('events/index', { events, user, utcDate, committed, recorded });
      });
    });
  })  
};

function getCommitted(allUsers, user) {
  let committed = {}
  allUsers.forEach(u => {
    u.events.forEach(e => {
      if (committed[e]) {
        if (!u.equals(user)) {
          committed[e].push(u.firstName)  
        }
      } else {
        if (!u.equals(user)) {
          committed[e] = [u.firstName] 
        }
      }
    })
  })
  return committed
}

function getRecorded(allUsers, events) {
  let recorded = {}
  allUsers.forEach(u => {
    events.forEach(e => {
      if (recorded[e._id]) {
        if (u.rounds.findIndex(r => r.event.equals(e._id)) > -1) {
          if (u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].netScore !== null) {
            recorded[e._id].push([u.firstName, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].handicap, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].grossScore, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].netScore])  
          } 
        }
      } else {
        if (u.rounds.findIndex(r => r.event.equals(e._id)) > -1) {
          if (u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].netScore !== null) {
            recorded[e._id] = [[u.firstName, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].handicap, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].grossScore, u.rounds[u.rounds.findIndex(r => r.event.equals(e._id))].netScore]]
          }    
        }
      }
    })
  })
  return recorded
}

