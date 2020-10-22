const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roundSchema = new Schema({
  user: Schema.Types.ObjectId,
  event: Schema.Types.ObjectId,
  scores: [Number],
  handicap: Number
});

module.exports = mongoose.model('Round', roundSchema);