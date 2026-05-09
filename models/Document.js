const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  pageCount: {
    type: Number,
    default: 0
  },
  extractedText: {
    type: String
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded'
  },
  requiresOCR: {
    type: Boolean,
    default: false
  },
  filePath: {
    type: String
  },
  mimeType: {
    type: String
  }
});

module.exports = mongoose.model('Document', documentSchema);
