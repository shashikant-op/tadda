const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add subject name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Please add parent branch']
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

subjectSchema.index({ slug: 1, branch: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
