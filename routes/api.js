const express = require('express');
const router = express.Router();
const Hello = require('../models/hello');

router.get('/hellos', (req, res, next) => {
  Hello.find({}, 'text')
    .then((data) => res.json(data))
    .catch(next);
});

router.post('/hellos', (req, res, next) => {
  if (req.body.text) {
    Hello.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: 'Empty text invalid',
    });
  }
});

router.get('/hellos/:id', (req, res, next) => {
  Hello.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;