const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  roles: [String]
});

// when user signs up, we generate hash from user's supplied password
userSchema.methods.generateHash = function(password) {
  // auto-generate a salt and hash
  return this.password = bcrypt.hashSync(password, 8);
};

// when user signs back in, we compare user's supplied password
// against our stored hash (encrypted password)
userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
