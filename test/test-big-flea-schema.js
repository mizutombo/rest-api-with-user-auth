const BigFlea = require('../lib/models/big-flea-schema');
const assert = require('chai').assert;

describe('BigFlea model', () => {

  it('validates with subtype and color', done => {
    const bigflea = new BigFlea({
      subtype: 'subtype',
      color: 'color'
    });
    bigflea.validate(err  => {
      if (!err) done();
      else done(err);
    });
  });

  it('subtype is required', done => {
    const bigflea = new BigFlea();
    bigflea.color = 'color';
    bigflea.validate(err => {
      assert.isOk(err, 'subtype is required');
      done();
    });
  });

  it('color is required', done => {
    const bigflea = new BigFlea();
    bigflea.subtype = 'subtype';
    bigflea.validate(err => {
      assert.isOk(err, 'color is required');
      done();
    });
  });

  it('subtype is a string', done => {
    const bigflea = new BigFlea();
    bigflea.subtype = 1;
    bigflea.validate(err => {
      assert.isOk(err, 'subtype must be a string');
      done();
    });
  });

  it('color is a string', done => {
    const bigflea = new BigFlea();
    bigflea.color = 1;
    bigflea.validate(err => {
      assert.isOk(err, 'color must be a string');
      done();
    });
  });

});
