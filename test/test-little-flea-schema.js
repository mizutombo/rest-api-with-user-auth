const LittleFlea = require('../lib/models/little-flea-schema');
const assert = require('chai').assert;

describe('LittleFlea model', () => {

  it('validates with subtype, color, & venom', done => {
    const littleflea = new LittleFlea({
      subtype: 'subtype',
      color: 'color',
      venom: 'venom'
    });
    littleflea.validate(err  => {
      if (!err) done();
      else done(err);
    });
  });

  it('subtype is required', done => {
    const littleflea = new LittleFlea();
    littleflea.color = 'color';
    littleflea.venom = 'venom';
    littleflea.validate(err => {
      assert.isOk(err, 'subtype is required');
      done();
    });
  });

  it('color is required', done => {
    const littleflea = new LittleFlea();
    littleflea.subtype = 'subtype';
    littleflea.venom = 'venom';
    littleflea.validate(err => {
      assert.isOk(err, 'color is required');
      done();
    });
  });

  it('venom is required', done => {
    const littleflea = new LittleFlea();
    littleflea.subtype = 'subtype';
    littleflea.color = 'color';
    littleflea.validate(err => {
      assert.isOk(err, 'venom is required');
      done();
    });
  });

  it('subtype is a string', done => {
    const littleflea = new LittleFlea();
    littleflea.subtype = 1;
    littleflea.validate(err => {
      assert.isOk(err, 'subtype must be a string');
      done();
    });
  });

  it('color is a string', done => {
    const littleflea = new LittleFlea();
    littleflea.color = 1;
    littleflea.validate(err => {
      assert.isOk(err, 'color must be a string');
      done();
    });
  });

  it('venom is a string', done => {
    const littleflea = new LittleFlea();
    littleflea.venom = 1;
    littleflea.validate(err => {
      assert.isOk(err, 'venom must be a string');
      done();
    });
  });

});
