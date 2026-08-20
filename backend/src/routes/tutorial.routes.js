const express = require('express');
const router = express.Router();
const {
  createTutorial, getTutorials, searchTutorials, getTutorialBySlug,
  updateTutorial, deleteTutorial, publishTutorial, uploadImage, getAuthorTutorials, reorderTutorials
} = require('../controllers/tutorial.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/author/me', protect, authorize('author', 'admin'), getAuthorTutorials);
router.post('/reorder', protect, authorize('author', 'admin'), reorderTutorials);
router.get('/', getTutorials);
router.get('/search', searchTutorials);
router.get('/:slug', getTutorialBySlug);

router.post('/', protect, authorize('author', 'admin'), createTutorial);
router.put('/:id', protect, authorize('author', 'admin'), updateTutorial);
router.delete('/:id', protect, authorize('author', 'admin'), deleteTutorial);
router.patch('/:id/publish', protect, authorize('author', 'admin'), publishTutorial);

router.post('/upload/image', protect, authorize('author', 'admin'), upload.single('image'), uploadImage);

module.exports = router;
