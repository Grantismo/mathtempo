'use strict';

var _ = require('lodash');
var Problem = require('./problem.model');
var glicko2 = require('glicko2');


// Get list of problems
exports.index = function(req, res) {
  Problem.find({}, '-answer', function (err, problems) {
    if(err) { return handleError(res, err); }
    return res.json(200, problems);
  });
};

// Get a single problem
exports.show = function(req, res) {
  Problem.findById(req.params.id, function (err, problem) {
    if(err) { return handleError(res, err); }
    if(!problem) { return res.send(404); }
    return res.json(problem);
  });
};

// Creates a new problem in the DB.
exports.create = function(req, res) {
  Problem.create(req.body, function(err, problem) {
    if(err) { return handleError(res, err); }
    return res.json(201, problem);
  });
};

// Updates an existing problem in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Problem.findById(req.params.id, function (err, problem) {
    if (err) { return handleError(res, err); }
    if(!problem) { return res.send(404); }
    var updated = _.merge(problem, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, problem);
    });
  });
};

// Deletes a problem from the DB.
exports.destroy = function(req, res) {
  Problem.findById(req.params.id, function (err, problem) {
    if(err) { return handleError(res, err); }
    if(!problem) { return res.send(404); }
    problem.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.answer = function(req, res) {
  Problem.findById(req.params.id, function (err, problem) {
    if(err) { return handleError(res, err); }
    if(!problem) { return res.send(404); }
    var user = req.user;

    //calculate new ratings
    var ranking = new glicko2.Glicko2();
    var p = ranking.makePlayer(problem.rating, problem.rating_deviation, problem.rating_volitility);
    console.log(p);
    var u = ranking.makePlayer(user.rating, user.rating_deviation, user.rating_volitility);
    var result = problem.checkAnswer(req.body);
    var match = [u, p, (result ? 1: 0)];


    ranking.updateRatings([match]);


    //update models

    var userRatingChange = u.getRating() - user.rating;
    user.rating = u.getRating(); 
    user.rating_deviation = u.getRd();
    user.rating_volitility = u.getVol();


    var problemRatingChange = p.getRating() - problem.rating;
    problem.rating = p.getRating();
    problem.rating_deviation = p.getRd();
    problem.rating_volitility = p.getVol();

    user.save(function (err) {
      if (err) { return handleError(res, err); }
      problem.save(function (err2) {
        if (err2) { return handleError(res, err2); }
        return res.json(201, {
          correct: result,
          userRatingChange: userRatingChange,
          problemRatingChange: problemRatingChange
        });
      });
    });
    
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
