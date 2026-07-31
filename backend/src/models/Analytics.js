const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
