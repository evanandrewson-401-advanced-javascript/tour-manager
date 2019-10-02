const request = require('../request');
const db = require('../db');

const postTour = function(tour) {
  return request
    .post('/api/tours')
    .send(tour)
    .expect(200)
    .then(({ body }) => body);
}

describe('tours api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const northAmericanTour = {
    title: 'North American Tour',
    activities: ['music', 'food', 'beer'],
    stops: []
  };


  it('posts a tour', () => {
    return postTour(northAmericanTour).then(tour => {
      expect(tour).toEqual({
        _id: expect.any(String),
        __v: 0,
        launchDate: expect.any(String),
        ...northAmericanTour
      });
    });
  });

  it('gets a tour by id', () => {
    return postTour(northAmericanTour)
      .then(tour => {
        return request.get(`/api/tours/${tour._id}`).expect(200);
      })
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "music",
              "food",
              "beer",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "North American Tour",
          }
        `
        );
      });
  });

  it('gets all tours', () => {
    return Promise.all([
      postTour(northAmericanTour),
      postTour(northAmericanTour),
      postTour(northAmericanTour)
    ])
      .then(() => {
        return request.get('/api/tours').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "music",
              "food",
              "beer",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "North American Tour",
          }
        `
        );
      });
  });
});

module.exports = postTour;