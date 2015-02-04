var repl = require("repl");

// Set default node environment to development
var envName = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./server/config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var Problem = require('./server/api/problem/problem.model');
var User = require('./server/api/user/user.model');

var replServer = repl.start({
  prompt: "mathtempo (" + envName + ") > "
});

replServer.context.config = config;
replServer.context.User = User;
replServer.context.Problem = Problem;


