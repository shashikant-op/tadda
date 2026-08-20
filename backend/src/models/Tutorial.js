const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a tutorial title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  content: {
    type: String,
    required: [true, 'Please add tutorial content']
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }],
  video: {
    url: { type: String, default: '' },
    platform: { type: String, default: 'youtube' }
  },
  codeBlocks: [
    {
      language: { type: String, required: true },
      code: { type: String, required: true }
    }
  ],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }]
  },
  relatedTutorials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial'
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  order: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

tutorialSchema.index({ title: 'text', description: 'text', content: 'text' });
tutorialSchema.index({ branch: 1, subject: 1, topic: 1 });

module.exports = mongoose.model('Tutorial', tutorialSchema);
