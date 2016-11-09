const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();

// validate a token (verify whether or not it is good)
router.post('/validate', ensureAuth, (req, res, next) => { // eslint-disable-line
  res.send({valid: true});
});

router.post('/signup', jsonParser, (req, res, next) => {
  // req.body will have both username & password properties
  const {username, password} = req.body;

  //we have a reference, so remove password from body
  delete req.body.password;

  if(!username || !password) {
    return next({
      code: 400,
      error: 'username and password must be supplied'
    });
  }

  // try to find user that already has this user name
  User.find({username}) // same as: {username: username}
    .count()
    .then(count => {
      // check if username already exists
      if (count > 0) {
        throw {code: 400, error: `username ${username} already exists`};
      }
      // create a user object, hash password, and save
      const user = new User(req.body);
      user.generateHash(password);
      return user.save();
    })
    // create a token for subsequent requests
    .then(user => token.sign(user))
    // sned back as response
    .then(token => res.send({token}))
  .catch(next);
});

router.post('/signin', jsonParser, (req, res, next) => {
  // req.body will have username & password
  const {username, password} = req.body;
  // we have a reference, so remove from body
  delete req.body.password;

  // find user by username
  User.findOne({username})
    .then(user => {
      // ensure user exists (!user) and password is validate
      if (!user || !user.compareHash(password)) {
        throw {code: 400, error: 'invalid username or password'};
      }
      // create a token for subsequent requests
      return token.sign(user);
    })
    // send back as response
    .then(token => res.send({token}))
    .catch(next);
});

module.exports = router;
