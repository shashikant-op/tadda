const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  tutorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial',
    required: true
  },
  questions: [
    {
      question: {
        type: String,
        required: true
      },
      options: [{
        type: String,
        required: true
      }],
      correctAnswer: {
        type: String,
        required: true
      },
      explanation: {
        type: String,
        default: ''
      }
    }
  ]
}, {
  timestamps: true
});

quizSchema.index({ tutorial: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
