const jwt = require('jsonwebtoken');

// app secret that enables tokens to be "untampered with"
const subrosa = process.env.APP_SECRET || 'app-subrosa';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {
      // (jwt optional) data to be stored in token as
      // 'transparent' data, i.e. can be seen, but
      // cannot be modified without invalidating token
      const payload = {
        id: user._id,
        roles: user.roles
      };

      // create token with payload and use app secret
      jwt.sign(payload, subrosa, null, (err, token) => {
        // something went wrong ...
        if (err) return reject(err);
        // then return newly created token
        resolve(token);
      });
    });
  },
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify (token, subrosa, (err, payload) => {
        // if token was bad, invalid, or expired (if preset), then reject
        if (err) return reject(err);
        // pass back payload data
        resolve(payload);
      });
    });
  }
};
