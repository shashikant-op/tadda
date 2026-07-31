const express = require('express');
const router = express.Router();
const { markProgressCompleted, getProgress } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', protect, getProgress);
router.post('/:tutorialId', protect, authorize('student', 'author', 'admin'), markProgressCompleted);

module.exports = router;
