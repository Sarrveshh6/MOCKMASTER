const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    default: 'Mixed'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    default: 'Mixed'
  },
  mode: {
    type: String,
    enum: ['Quiz', 'Test'],
    default: 'Test'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  startedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
