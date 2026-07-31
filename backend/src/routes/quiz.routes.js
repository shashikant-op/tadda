const express = require('express');
const router = express.Router();
const { createQuiz, getQuiz, submitQuiz } = require('../controllers/quiz.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.post('/', protect, authorize('author', 'admin'), createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, authorize('student', 'author', 'admin'), submitQuiz);

module.exports = router;
