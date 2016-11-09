const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for 'BigFlea'
const schema = new Schema({
  subtype: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('BigFlea', schema);
