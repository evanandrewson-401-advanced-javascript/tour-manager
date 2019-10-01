const request = require('../request');
const db = require('../db');

describe('tours api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const northAmericanTour = {
    title: 'North American Tour',
    activities: ['music', 'food', 'beer'],
    stops: []
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

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
            _id: expect.any(String)
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
            "launchDate": "2019-10-01T21:43:21.429Z",
            "stops": Array [],
            "title": "North American Tour",
          }
        `
        );
      });
  });
});
