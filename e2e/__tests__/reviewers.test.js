const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');

describe('reviewers api', () => {
  beforeEach(() => {
    return db.dropCollection('reviewers');
  });

  const gene = {
    name: 'Gene Siskel',
    company: 'HBO'
  };

  const data = {
    rating: 5,
    reviewer: new mongoose.Types.ObjectId(),
    review: "It's great!",
    film: new mongoose.Types.ObjectId()
  };

  function postReviewer(obj) {
    return request
      .post('/api/reviewers')
      .send(obj)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a reviewer', () => {
    return postReviewer(gene).then(reviewer => {
      expect(reviewer).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...gene
      });
    });
  });

  it('gets a reviewer by id', () => {
    return postReviewer(gene).then(reviewer => {
      data.reviewer = reviewer._id;
      return request
        .post('/api/reviews')
        .send(data)
        .expect(200)
        .then(() => {
          return request
            .get(`/api/reviewers/${reviewer._id}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).toMatchInlineSnapshot(
                {
                  _id: expect.any(String),
                  reviews: [{ _id: expect.any(String) }]
                },
                `
                Object {
                  "__v": 0,
                  "_id": Any<String>,
                  "company": "HBO",
                  "name": "Gene Siskel",
                  "reviews": Array [
                    Object {
                      "_id": Any<String>,
                    },
                  ],
                }
              `
              );
            });
        });
    });
  });

  it('updates a reviewer', () => {
    return postReviewer(gene)
      .then(reviewer => {
        reviewer.company = 'Netflix';
        return request
          .put(`/api/reviewers/${reviewer._id}`)
          .send(reviewer)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.company).toBe('Netflix');
      });
  });

  it('gets all reviewers', () => {
    return Promise.all([
      postReviewer(gene),
      postReviewer(gene),
      postReviewer(gene)
    ])
      .then(() => {
        return request.get('/api/reviewers').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...gene
        });
      });
  });
});
