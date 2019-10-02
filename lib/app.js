const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');
const addGeolocation = require('./middleware/add-geolocation');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(checkConnection);
// app.use('/api/tours/:id/stops', addGeolocation);

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

// API ROUTES
const tours = require('./routes/tours-and-stops');
app.use('/api/tours', tours);



// NOT FOUND
const api404 = require('./middleware/api-404');
app.use('/api', api404);
// using express default 404 for non-api routes

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;