const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add topic name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Please add parent subject']
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

topicSchema.index({ slug: 1, subject: 1 });

module.exports = mongoose.model('Topic', topicSchema);
