/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Problem = require('../api/problem/problem.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Problem.find({}).remove(function() {
  var problems = [];
  for(var x = 0; x < 10; x++){
    for(var y = 0; y < 10; y++){
      for(var i = 0; i < 3; i++){
        var content = x + " " + ["+", "-", "*"][i] + " " + y;
        var answer = eval(content); // jshint ignore:line
        problems.push({content: content, answer: answer});
      }
    }
  } 

  Problem.create(problems, function() {
    console.log('finished populating problems');
  });
});
