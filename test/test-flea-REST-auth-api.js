const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

// start db ... store connection ... clear db
const connection = require('../lib/mongoose-setup');

const app = require('../lib/app');

describe('fleas', () => {

  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  let token = '';

  before(done => {
    request
      .post('/auth/signup')
      .send({username: 'testuser', password: 'abc'})
      .then(res => assert.ok(token = res.body.token))
      .then(done, done);
  });

  before(done => {
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else connection.on('open', dropCollection);

    function dropCollection() {
      const name = 'fleas';
      connection.db
        .listCollections({name})
        .next((err, collinfo) => {
          if (!collinfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const MongoFlea = { // test case big flea object
    subtype: 'mongo',
    color: 'blue'
  };

  const MicroFlea = { // test case little flea object
    subtype: 'micro',
    color: 'red',
    venom: 'neurotoxin'
  };


  it('/GET all big fleas', done => { // FAIL test for GET all when array is empty
    request
      .get('/BigFleas')
      .set('Authorization', `Bearer ${token}`)
      .set('admin', 'super-user')
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('/GET all little fleas', done => { // PASS test for GET all when array is empty
    request
      .get('/LittleFleas')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('/POST big flea', done => { // FAIL test for POST to big fleas collection
    request
      .post('/BigFleas')
      .set('Authorization', `Bearer ${token}`)
      .send(MongoFlea)
      .then(res => {
        const bigflea = res.body;
        assert.ok(bigflea._id);
        MongoFlea.__v = 0;
        MongoFlea._id = bigflea._id;
        done();
      })
      .catch(done);
  });

  it('/POST little flea', done => { // PASS test for POST to little fleas collection
    request
      .post('/LittleFleas')
      .set('Authorization', `Bearer ${token}`)
      .send(MicroFlea)
      .then(res => {
        const littleflea = res.body;
        assert.ok(littleflea._id);
        // MicroFlea.__v = 0;
        MicroFlea._id = littleflea._id;
        done();
      })
      .catch(done);
  });

  it('/GET big flea by id', done => { // FAIL test for GET big flea by id
    request
      .get(`/BigFleas/${MongoFlea._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        const bigflea = res.body;
        assert.deepEqual(bigflea._id, MongoFlea._id);
        done();
      })
      .catch(done);
  });

  it('/GET little flea by id', done => { // PASS test for GET little flea by id
    request
      .get(`/LittleFleas/${MicroFlea._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        const littleflea = res.body;
        assert.deepEqual(littleflea, MicroFlea);
        done();
      })
      .catch(done);
  });

  it('/GET all big fleas after post', done => { // FAIL test for GET all big fleas after POST
    request
      .get('/BigFleas')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        assert.deepEqual(res.body, [MongoFlea]);
        done();
      })
      .catch(done);
  });

  it('/GET all little fleas after post', done => { // PASS test for GET all little fleas after POST
    request
      .get('/LittleFleas')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        const littleflea = res.body;
        assert.deepEqual(littleflea, [MicroFlea]);
        assert.deepEqual(res.body, [MicroFlea]);
        done();
      })
      .catch(done);
  });

  it('add a new big flea', done => { // FAIL test for POST new big flea
    request
      .post('/BigFleas')
      .set('Authorization', `Bearer ${token}`)
      .send({subtype: 'giganto', color: 'green'})
      .then(res => {
        assert.ok(res.body._id);
        done();
      })
      .catch(done);
  });

  it('add a new little flea', done => { // PASS test for POST new little flea
    request
      .post('/LittleFleas')
      .set('Authorization', `Bearer ${token}`)
      .send({subtype: 'nano', color: 'black', venom: 'necrotic'})
      .then(res => {
        assert.ok(res.body._id);
        done();
      })
      .catch(done);
  });

  it('change venom of MicroFlea', done => { // PASS test for PUT ... change venom of little flea
    request
      .put(`/LittleFleas/${MicroFlea._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({subtype: 'micro', color: 'red', venom: 'tetrodotoxin'})
      .then(res => {
        assert.ok(res.body._id);
        done();
      })
      .catch(done);
  });

  it('/DELETE MicroFlea', done => { // PASS test to DELETE the MicroFlea
    request
      .del(`/LittleFleas/${MicroFlea._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        MicroFlea.__v = 0;
        assert.deepEqual(res.body, MicroFlea);
        done();
      })
      .catch(done);
  });

  after(done => {connection.close(done);
  });

});
