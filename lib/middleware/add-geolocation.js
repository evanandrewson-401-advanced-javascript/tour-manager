const getLocation = require('../services/maps-api');

module.exports = () => (req, res, next) => {
  const { address } = req.body;

  if(!address) {
    return next({
      statuscode: 400,
      error: 'address must be supplied'
    });
  }

  getLocation(address)
    .then(location => {
      if(!location) {
        throw {
          statuscode: 400,
          error: 'address must be resolvable to geolocation'
        };
      }

      req.body.location = location;
      next();
    })
    .catch(next);
};