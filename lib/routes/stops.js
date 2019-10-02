/* eslint-disable new-cap */
const router = require('express').Router();
const Stop = require('../models/stop');
const Tour = require('../models/tour');
const addGeo = require('../middleware/add-geolocation');

router
  .post('/', addGeo(), (req, res, next) => {
    const tourId = req.params.id;
    Stop.create(req.body)
    .then(stop => {
      // use stop id and tour id to update tour stops array
      Tour.findByIdAndUpdate(tourId, stop)
      res.json(stop)
    })
    .catch(next);
  });

module.exports = router;