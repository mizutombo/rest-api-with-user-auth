const tokenSvc = require('./token');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {
    // check for token in authorization header
    // (note that express lowercases all headers)
    const authHeader = req.headers.authorization;

    // didn't provde a token, trigger erro
    if (!authHeader) {
      return next({
        code: 400,
        error: 'unauthorized, no token provided'
      });
    }
    // authorization header is in form 'bearer token'
    const [bearer, jwt] = authHeader.split(' ');

    // check that we got right intro word and a jwt
    if (bearer !== 'Bearer' || !jwt) {
      return next({
        code: 400,
        error: 'unauthorized, invalid token'
      });
    }

    // verify the _actual_ jwt token
    tokenSvc.verify(jwt)
      .then(payload => {
        req.user = payload;
        next();
      })
      .catch(err => { // eslint-disable-line
        return next({
          code: 403,
          error: 'unauthorized, invalid token'
        });
      });
  };
};
