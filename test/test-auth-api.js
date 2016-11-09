const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

// start db ...
const connection = require('../lib/mongoose-setup');

const app = require('../lib/app');

describe('auth', () => {

  // drop and clear entire db instead of one collection
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  describe('unauthorized', () => {

    it('400 with no token', done => { // PASS
      request
        .get('/LittleFleas')
        .then(res => done('status should not be 200')) // eslint-disable-line
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'unauthorized, no token provided');
          done();
        })
        .catch(done);
    });

    it('403 with invalid token', done => { // PASS
      request
        .get('/LittleFleas')
        .set('Authorization', 'Bearer badtoken')
        .then(res => done('status should not be 200')) // eslint-disable-line
        .catch(res => {
          assert.equal(res.status, 403);
          assert.equal(res.response.body.error,'unauthorized, invalid token');
          done();
        })
        .catch(done);
    });
  });

  const user = {
    username: 'Regent',
    password: 'itchyscratchy'
  };

  describe('user management', () => {

    function badRequest(url, send, error, done) {
      request
        .post(url)
        .send(send)
        .then(res => done('status should not be 200')) // eslint-disable-line
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, error);
          done();
        })
        .catch(done);
    }

    it('signup requires username', done => { // PASS
      badRequest('/auth/signup', {password: 'abc'}, 'username and password must be supplied', done);
    });

    it('signup requires password', done => { // PASS
      badRequest('/auth/signup', {username: 'abc'}, 'username and password must be supplied', done);
    });

    let token = ''; // eslint-disable-line

    it('signup', done => {
      request
        .post('/auth/signup')
        .send(user)
        .then(res => assert.ok(token = res.body.token))
        .then(done, done);
    });

    it('can\'t use same username', done => {
      badRequest('/auth/signup', user, 'username Regent already exists', done);
    });

    it('token is valid', done => {
      request
        .get('/LittleFleas')
        .set('Authorization', `Bearer ${token}`)
        .then(res => assert.ok(res.body))
        .then(done, done);
    });

    it('signin', done => {
      request
        .post('/auth/signin')
        .send(user)
        .then(res => assert.equal(res.body.token, token))
        .then(done, done);
    });
  });
});
