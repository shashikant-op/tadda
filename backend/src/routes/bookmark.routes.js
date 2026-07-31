const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', protect, getBookmarks);
router.post('/:tutorialId', protect, authorize('student', 'author', 'admin'), addBookmark);
router.delete('/:tutorialId', protect, authorize('student', 'author', 'admin'), removeBookmark);

module.exports = router;
