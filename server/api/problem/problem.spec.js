'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');


describe('GET /api/problems', function() {

  it('should reject unauthorized user', function(done) {
    request(app)
      .get('/api/problems')
      .expect(401)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
