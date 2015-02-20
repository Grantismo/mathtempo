'use strict';

var _ = require('lodash');
var Problem = require('./problem.model');
var ratings = require('../../components/ratings');
var async = require('async');


// Get list of problems
exports.index = function(req, res) {
  Problem.find({}, '-answer').exec(function(err, problems) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, problems);
  });
};

// Get list of problems
exports.nextProblem = function(req, res) {
  var user = req.user;
  var range = user.rating_deviation * 2;
  var upperBound = user.rating + range;
  var lowerBound = user.rating - range;

  Problem.find({
    rating: {
      $gt: lowerBound,
      $lt: upperBound
    }
  }, '-answer').exec(function(err, problems) {
    if (err) {
      return handleError(res, err);
    }
    var problem = problems[Math.floor(Math.random() * problems.length)];
    return res.json(problem);
  });
};

// Get a single problem
exports.show = function(req, res) {
  Problem.findById(req.params.id).populate("comments.user", "name").exec(function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    if (!problem) {
      return res.send(404);
    }
    return res.json(problem);
  });
};

// Creates a new problem in the DB.
exports.create = function(req, res) {
  Problem.create(req.body, function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, problem);
  });
};

// Updates an existing problem in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Problem.findById(req.params.id, function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    if (!problem) {
      return res.send(404);
    }
    var updated = _.merge(problem, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, problem);
    });
  });
};

// Deletes a problem from the DB.
exports.destroy = function(req, res) {
  Problem.findById(req.params.id, function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    if (!problem) {
      return res.send(404);
    }
    problem.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// Creates a new problem in the DB.
exports.comment = function(req, res) {
  Problem.findById(req.params.id).populate("comments.user", "name").exec(function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    if (!problem) {
      return res.send(404);
    }
    problem.comments.push({
      content: req.body.content,
      user: req.user
    });

    problem.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(201, problem);
    });
  });
};

exports.answer = function(req, res) {
  Problem.findById(req.params.id, function(err, problem) {
    if (err) {
      return handleError(res, err);
    }
    if (!problem) {
      return res.send(404);
    }

    var user = req.user;
    var correct = problem.addAnswer(req);

    ratings.updateRatings({
      user: user,
      problem: problem,
      result: correct,
      solve_time: req.body.solve_time
    }, function(err, data) {

      var updated_user = data.user;
      var updated_problem = data.problem;

      updated_user.updateRank(function(err, result) {
        async.map([updated_user, updated_problem], function(obj, callback){
          obj.save(callback);
        }, function(err, result) {
          if (err) {
            return handleError(res, err);
          }

          var data = {
            correct: correct,
            user: updated_user,
            problem: updated_problem
          };

          console.log(data);
          return res.json(201, data);
        });
      });
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
