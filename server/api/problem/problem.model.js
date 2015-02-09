'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');


var CommentSchema = new Schema({
    content: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parent_comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
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
    comments: [CommentSchema]
});

ProblemSchema.plugin(timestamps);

ProblemSchema.methods = {
    checkAnswer: function(req) {
        var a = req.answer;
        return this.answer === a;
    }
}

module.exports = mongoose.model('Problem', ProblemSchema);
