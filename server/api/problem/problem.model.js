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
    default: 1200
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
  }
});

ProblemSchema.plugin(timestamps);

ProblemSchema.methods = {
  checkAnswer: function(req) {
    var a = req.answer;
    return this.answer === a;
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
