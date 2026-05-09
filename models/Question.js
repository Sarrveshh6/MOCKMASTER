
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: false
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    validate: [v => v.length === 4, 'Must have exactly 4 options'],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  subject: {
    type: String,
    default: 'General'
  },
  topic: {
    type: String,
    default: 'General'
  },
  explanation: {
    type: String,
    required: false
  },
  source: {
    type: String,
    default: 'AI Extracted'
  },
  isBankQuestion: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
