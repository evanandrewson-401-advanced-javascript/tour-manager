const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  activities: [{type: String}],
  launchDate: {
    type: Date,
    default: Date.now()
  },
  stops: [{
    stop: {
      location: {
        latitude: String,
        longitude: String
      },
      weather: {
        forecast: String
      },
      attendance: {
        type: Number,
        min: 1
      }
    }
  }]
})

module.exports = mongoose.model('Tour', schema)