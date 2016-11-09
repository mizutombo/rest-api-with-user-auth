const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for 'LittleFlea'
const schema = new Schema({
  subtype: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  venom: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model('LittleFlea', schema);
