const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileType: {
    type: String,
    enum: ['excel', 'pdf', 'unknown'],
    default: 'unknown'
  },
  columns: [{
    name: String,
    type: String
  }],
  data: [{
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }],
  processedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('File', fileSchema);
