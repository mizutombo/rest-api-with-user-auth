const express = require('express');
const bodyParser = require('body-parser').json();
const router = express.Router();
const LittleFlea = require('../models/little-flea-schema');

router
  .get('/', (req, res, next) => {
    LittleFlea.find()
      .select('subtype color venom fleaId')
      .populate({
        path: 'fleaId',
        select: 'venom'
      })
      .lean()
      .then(littlefleas => res.send(littlefleas))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    LittleFlea.findById(req.params.id)
      .select('subtype color venom fleaId')
      .populate({
        path: 'fleaId',
        select: 'venom'
      })
      .lean()
      .then(LittleFlea => res.send(LittleFlea))
      .catch(next);
  })

  .post('/', bodyParser, (req, res, next) => {
    new LittleFlea(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  })

  .put('/:id', bodyParser, (req, res, next) => {
    LittleFlea.findByIdAndUpdate(req.params.id)
      .then(saved => res.send(saved))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    LittleFlea.findByIdAndRemove(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });

module.exports = router;
