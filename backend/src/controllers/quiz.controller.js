const Quiz = require('../models/Quiz');
const Tutorial = require('../models/Tutorial');
const Progress = require('../models/Progress');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const createQuiz = async (req, res, next) => {
  try {
    const { tutorial, questions } = req.body;
    const tut = await Tutorial.findById(tutorial);
    if (!tut) {
      throw new ApiError(404, 'Tutorial not found');
    }

    const quiz = await Quiz.create({ tutorial, questions });
    tut.quiz = quiz._id;
    await tut.save();

    res.status(201).json(new ApiResponse(201, 'Quiz created successfully', { quiz }));
  } catch (err) {
    next(err);
  }
};

const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new ApiError(404, 'Quiz not found');
    }
    res.status(200).json(new ApiResponse(200, 'Quiz fetched successfully', { quiz }));
  } catch (err) {
    next(err);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selected answers matching questions order
    if (!answers || !Array.isArray(answers)) {
      throw new ApiError(400, 'Answers array is required');
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new ApiError(404, 'Quiz not found');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q, index) => {
      if (answers[index] && answers[index].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    // If passed or submitted, mark tutorial progress as completed
    if (quiz.tutorial) {
      await Progress.findOneAndUpdate(
        { user: req.user._id, tutorial: quiz.tutorial },
        { completed: true, completedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.status(200).json(new ApiResponse(200, 'Quiz submitted successfully', {
      score,
      correctAnswers: correctCount,
      totalQuestions
    }));
  } catch (err) {
    next(err);
  }
};

module.exports = { createQuiz, getQuiz, submitQuiz };
