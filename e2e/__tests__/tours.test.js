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
  }

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

});