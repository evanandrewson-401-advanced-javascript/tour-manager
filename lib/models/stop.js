const mongoose = require('mongoose');
const { Schema } = mongoose;



const schema = new Schema({
  location: {
    latitude: String,
    longitude: String
  },
  weather: [{
    time: String,
    forecast: String
  }],
  attendance: {
    type: Number,
    min: 1
  }
});

module.exports = mongoose.model('Stop', schema);