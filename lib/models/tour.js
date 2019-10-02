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
    type: mongoose.Types.ObjectId
  }]
})

module.exports = mongoose.model('Tour', schema)