const getForecast = require('../services/weather-api')

module.exports = () => (req, res, next) => {
  const { latitude, longitude } = req.body.location

  if(!latitude) {
    return next({
      statuscode: 400,
      error: 'latitude and longitude must be supplied'
    });
  }

  getForecast(latitude, longitude)
    .then(forecast => {
      req.body.weather = forecast;
      next();
    })
    .catch(next);
}