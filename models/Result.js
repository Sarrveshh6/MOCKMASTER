const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestAttempt',
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correct: {
    type: Number,
    required: true
  },
  incorrect: {
    type: Number,
    required: true
  },
  skipped: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number, // percentage
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  questionWiseResult: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: String,
    isCorrect: Boolean,
    isSkipped: Boolean
  }],
  topicWiseBreakdown: [{
    topic: String,
    totalAttempted: Number,
    correct: Number,
    accuracy: Number
  }]
});

module.exports = mongoose.model('Result', resultSchema);
