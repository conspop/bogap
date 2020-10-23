const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roundSchema = new Schema({
  user: Schema.Types.ObjectId,
  event: Schema.Types.ObjectId,
  scores: [String],
  handicap: Number,
  grossScore: Number,
  netScore: Number
});

module.exports = mongoose.model('Round', roundSchema);