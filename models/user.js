const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  admin: {type:Boolean, default:false},
  googleId: String,
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  handicap: Number,
  events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
  rounds: [{type: Schema.Types.ObjectId, ref: 'Round'}]
});

module.exports = mongoose.model('User', userSchema);

