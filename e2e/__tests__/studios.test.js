const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');

describe('Studio api', () => {
  beforeEach(() => {
    return db.dropCollection('studios')
    .then (() => {
      return db.dropCollection('films');

    })
  });

  const hbo = {
    name: 'HBO',
    address: {
      city: 'New York',
      state: 'New York',
      country: 'United States'
    }
  };

  let data = {
    title: 'The Matrix',
    // studio: new mongoose.Types.ObjectId(),
    released: 1999,
    cast: [
      {
        role: 'wizard',
        actor: new mongoose.Types.ObjectId()
      }
    ]
  };

  function postStudio(studio) {
    return request
      .post('/api/studios')
      .send(studio)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a studio', () => {
    return postStudio(hbo).then(studio => {
      expect(studio).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...hbo
      });
    });
  });

  it('gets all studios', () => {
    return Promise.all([postStudio(hbo), postStudio(hbo), postStudio(hbo)])
      .then(() => {
        return request.get('/api/studios').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...hbo
        });
      });
  });

  it('gets a studio by id', () => {
    return postStudio(hbo).then(studio => {
      data.studio = studio._id;
      return request
        .post('/api/films')
        .send(data)
        .expect(200)
        .then(() => {
          return request
            .get(`/api/studios/${studio._id}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).toMatchInlineSnapshot(
                {
                  _id: expect.any(String),
                  films: [{ _id: expect.any(String) }]
                },
                `
                Object {
                  "__v": 0,
                  "_id": Any<String>,
                  "address": Object {
                    "city": "New York",
                    "country": "United States",
                    "state": "New York",
                  },
                  "films": Array [
                    Object {
                      "_id": Any<String>,
                    },
                  ],
                  "name": "HBO",
                }
              `
              );
            });
        });
    });
  });

  it('deletes a studio', () => {
    return postStudio(hbo).then(studio => {
      return request.delete(`/api/studios/${studio._id}`).expect(200);
    });
  });

  it.skip('returns error if studio has a film', () => {
    return postStudio(hbo).then(studio => {
      const bla = {
        ...data, 
        studio: studio._id
      }
      return request
        .post('/api/films')
        .send(data)
        .expect(200)
        .then(() => {
          expect (() => {
            request.delete(`/api/studios/${bla.studio}`);
          }).toThrow();
          // return request
          //  .delete(`/api/studios/${studio._id}`).expect(405)
        });
    });
  });
});
