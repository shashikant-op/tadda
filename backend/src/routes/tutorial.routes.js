const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  createTutorial, getTutorials, searchTutorials, getTutorialBySlug,
  getTutorialContentImage, updateTutorial, deleteTutorial, publishTutorial, uploadImage, getAuthorTutorials, reorderTutorials
} = require('../controllers/tutorial.controller');
const { protect, optionalProtect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many search requests, please try again shortly' }
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many uploads, please try again later' }
});

router.get('/author/me', protect, authorize('author', 'admin'), getAuthorTutorials);
router.post('/reorder', protect, authorize('author', 'admin'), reorderTutorials);
router.get('/', optionalProtect, getTutorials);
router.get('/search', searchLimiter, searchTutorials);
router.get('/:id/content-images/:index', getTutorialContentImage);
router.get('/:slug', optionalProtect, getTutorialBySlug);

router.post('/', protect, authorize('author', 'admin'), createTutorial);
router.put('/:id', protect, authorize('author', 'admin'), updateTutorial);
router.delete('/:id', protect, authorize('author', 'admin'), deleteTutorial);
router.patch('/:id/publish', protect, authorize('author', 'admin'), publishTutorial);

router.post('/upload/image', uploadLimiter, protect, authorize('author', 'admin'), upload.single('image'), uploadImage);

module.exports = router;
