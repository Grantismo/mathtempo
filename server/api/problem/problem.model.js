'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');


var CommentSchema = new Schema({
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  parent_comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
});

var AnswerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  answer: String,
  solve_time: Number
});

CommentSchema.plugin(timestamps);

var ProblemSchema = new Schema({
  rating: {
    type: Number,
    default: 1200,
    index: true
  },
  rating_change: {
    type: Number,
    default: 0 
  },
  rating_deviation: {
    type: Number,
    default: 200
  },
  rating_volitility: {
    type: Number,
    default: 0.06
  },
  content: String,
  active: {
    type: Boolean,
    default: true
  },
  answer: String,
  comments: [CommentSchema],
  answers: [AnswerSchema],
  average_solve_time: {
    type: Number,
    default: 0
  },
  sd_solve_time: {
    type: Number,
    default: 0
  }
});

ProblemSchema.plugin(timestamps);

ProblemSchema.methods = {
  addAnswer: function(req) {
    this.answers.push({
      user: req.user,
      solve_time: req.body.solve_time,
      answer: req.body.answer
    });
    this.updateSolveTime(req.body.solve_time);
    return this.checkAnswer(req.body);
  },
  checkAnswer: function(body) {
    var a = body.answer;
    return this.answer === a;
  },
  updateSolveTime: function(solveTime) {
    var n = this.answers.length;

    //incremental standard deviation http://math.stackexchange.com/questions/102978/incremental-computation-of-standard-deviation
    if (n > 1) {
      this.sd_solve_time = Math.sqrt(((n - 2) * Math.pow(this.sd_solve_time, 2))/(n - 1) + Math.pow(solveTime - this.average_solve_time, 2) / n);

      this.average_solve_time = (this.average_solve_time * (n - 1) + solveTime) / n; //incremental average
    }
  }
}


ProblemSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Problem', ProblemSchema);
