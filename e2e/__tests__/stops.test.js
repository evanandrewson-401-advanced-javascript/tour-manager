jest.mock('../../lib/services/maps-api');
const request = require('../request');
const db = require('../db');
const postTour = require('./tours.test');
const getLocation = require('../../lib/services/maps-api');

getLocation.mockResolvedValue({
  latitude: 45.5113506,
  longitude: -122.6456739
});

describe.skip('stops api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const northAmericanTour = {
    title: 'North American Tour',
    activities: ['music', 'food', 'beer'],
    stops: []
  };

  it('posting a stop pulls in geolocation and weather data', () => {
    return postTour(northAmericanTour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .expect(200)
        .send({ address: 97214 })
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String),
              weather: expect.any(Array)
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "location": Object {
                "latitude": "45.5113506",
                "longitude": "-122.6456739",
              },
              "weather": Any<Array>,
            }
          `
          );
        });
    });
  });

  it('deletes a stop', () => {
    return postTour(northAmericanTour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .expect(200)
        .send({ address: 97214 })
        .then(stop => {
          return request
            .delete(`/api/tours/${tour._id}/stops/${stop._id}`)
            .expect(200);
        });
    });
  });

  it('updates a stop with attendees', () => {
    return postTour(northAmericanTour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .expect(200)
        .send({ address: 97214 })
        .then(({ body }) => {
          return request
            .put(`/api/tours/${tour._id}/stops/${body._id}`)
            .expect(200)
            .send({ attendance: 50 })
            .then(stop => {
              console.log(stop.body);
              expect(stop.body).toMatchInlineSnapshot(
                {
                  _id: expect.any(String),
                  weather: expect.any(Array)
                },
                `
                Object {
                  "__v": 0,
                  "_id": Any<String>,
                  "location": Object {
                    "latitude": "45.5113506",
                    "longitude": "-122.6456739",
                  },
                  "weather": Any<Array>,
                }
              `
              );
            });
        });
    });
  });
});
