const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  date: Date,
  cost: Number,
  details: String,
  courseName: String,
  courseAddress: String,
  coursePic: String,
  courseRating: Number,
  courseSlope: Number,
  coursePars: [Number]
});

module.exports = mongoose.model('Event', eventSchema);