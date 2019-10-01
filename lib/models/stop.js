const mongoose = require('mongoose');
import { Schema } from "mongoose";



const schema = new Schema({
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
});

module.exports = mongoose.model('Stop', schema);