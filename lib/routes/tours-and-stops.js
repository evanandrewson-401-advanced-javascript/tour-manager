/* eslint-disable new-cap */
const router = require('express').Router();
const Stop = require('../models/stop');
const Tour = require('../models/tour');
const addGeo = require('../middleware/add-geolocation');
const addWeather = require('../middleware/add-weather');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tour.findById(req.params.id)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tour.find()
      .then(tours => res.json(tours))
      .catch(next);
  })
  //STOPS ROUTES
  .post('/:tourId/stops', addGeo(), addWeather(), (req, res, next) => {
    const tourId = req.params.tourId;
    Stop.create(req.body)
      .then(stop => {
        Tour.findByIdAndUpdate(tourId,{$push: {stops: stop._id}}).then(() => {
          res.json(stop)
      });
    })
    .catch(next);
  })
  .delete('/:tourId/stops/:stopId', (req, res, next) => {
    Stop.findOneAndRemove(req.params.stopId)
      .then(stop => res.json(stop))
      .catch(next);
  })
  .put('/:tourId/stops/:stopId', (req, res, next) => {
    Stop.findByIdAndUpdate(req.params.stopId, req.body)
      .then(stop => res.json(stop))
      .catch(next);
  });

  module.exports = router;