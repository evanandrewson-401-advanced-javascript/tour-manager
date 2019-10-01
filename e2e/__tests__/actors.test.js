const request = require('../request');
const db = require('../db');
const mongoose = require('mongoose');

describe('actors api', () => {
  beforeEach(() => {
    return db.dropCollection('actors');
  });

  const brad = {
    name: 'Brad Pitt',
    dob: new Date(1963, 11, 18),
    pob: 'Shawnee, OK'
  };

  const data = {
    title: 'The Matrix',
    studio: new mongoose.Types.ObjectId(),
    released: 1999,
    cast: [
      {
        role: 'wizard',
        actor: new mongoose.Types.ObjectId()
      }
    ]
  };

  function postActor(obj) {
    return request
      .post('/api/actors')
      .send(obj)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts an actor', () => {
    return postActor(brad).then(actor => {
      expect(actor).toEqual({
        _id: expect.any(String),
        __v: 0,
        name: 'Brad Pitt',
        dob: expect.any(String),
        pob: 'Shawnee, OK'
      });
    });
  });

  it('gets all actors', () => {
    return Promise.all([postActor(brad), postActor(brad), postActor(brad)])
      .then(() => {
        return request.get('/api/actors').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toEqual({
          name: 'Brad Pitt',
          dob: expect.any(String),
          pob: 'Shawnee, OK',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets an actor by id', () => {
    return postActor(brad).then(actor => {
      data.cast[0].actor = actor._id;
      return request
        .post('/api/films')
        .send(data)
        .expect(200)
        .then(() => {
          return request
            .get(`/api/actors/${actor._id}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).toMatchInlineSnapshot(
                {
                  _id: expect.any(String),
                  films: [
                    {
                      _id: expect.any(String)
                    }
                  ]
                },
                `
                Object {
                  "__v": 0,
                  "_id": Any<String>,
                  "dob": "1963-12-18T00:00:00.000Z",
                  "films": Array [
                    Object {
                      "_id": Any<String>,
                      "released": 1999,
                      "title": "The Matrix",
                    },
                  ],
                  "name": "Brad Pitt",
                  "pob": "Shawnee, OK",
                }
              `
              );
            });
        });
    });
  });
});
