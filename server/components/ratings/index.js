'use strict';

var glicko2 = require('glicko2');

/*
 * params.user
 * params.problem
 * params.result [win or loss]
 * params.solve_time
 */
function updateRatings(params, callback) {
  var user = params.user;
  var problem = params.problem;
  var result = params.result;
  var solve_time = params.solve_time;

  var ranking = new glicko2.Glicko2({
    tau: 0.5,
    rating: 1200,
    rd: 200,
    vol: 0.06
  });

  var p = ranking.makePlayer(problem.rating, problem.rating_deviation, problem.rating_volitility);
  var u = ranking.makePlayer(user.rating, user.rating_deviation, user.rating_volitility);

  var score = result ? 1 :  0;
  if(result && problem.answers.length > 1){ //todo modify so time penalty occurs when problem.sd becomes low
    var upper_bound = problem.average_solve_time + problem.sd_solve_time 
    var lower_bound = problem.average_solve_time - problem.sd_solve_time 

    if (solve_time < lower_bound) {
      score = 1.25; //bonus for faster than sd
    }else if(solve_time > upper_bound) {
      score = 0.5; //penalty for slower than sd
    } 
  }
  var match = [u, p, score];


  ranking.updateRatings([match]);

  //update models
  user.rating_change = u.getRating() - user.rating;
  user.rating = u.getRating();
  user.rating_deviation = u.getRd();
  user.rating_volitility = u.getVol();
  user.ratings.push({
    rating: user.rating,
    date: new Date()
  });


  problem.rating_change = p.getRating() - user.rating;
  problem.rating = p.getRating();
  problem.rating_deviation = p.getRd();
  problem.rating_volitility = p.getVol();
  callback(null, {user: user, problem: problem});
}

exports.updateRatings = updateRatings;
