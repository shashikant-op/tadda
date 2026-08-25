const express = require('express');
const router = express.Router();
const {
  createBranch, getBranches, getBranchImage, getBranchBySlug, updateBranch, deleteBranch,
  createSubject, getSubjects, getSubjectBySlug, updateSubject, deleteSubject,
  createTopic, getTopics, getTopicBySlug, updateTopic, deleteTopic, reorderTopics
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// --- Branches Routes ---
router.post('/branches', protect, authorize('admin'), createBranch);
router.get('/branches', getBranches);
router.get('/branches/:id/image', getBranchImage);
router.get('/branches/:slug', getBranchBySlug);
router.put('/branches/:id', protect, authorize('admin'), updateBranch);
router.delete('/branches/:id', protect, authorize('admin'), deleteBranch);

// --- Subjects Routes ---
router.post('/subjects', protect, authorize('author', 'admin'), createSubject);
router.get('/subjects', getSubjects);
router.get('/subjects/:slug', getSubjectBySlug);
router.put('/subjects/:id', protect, authorize('author', 'admin'), updateSubject);
router.delete('/subjects/:id', protect, authorize('admin'), deleteSubject);

// --- Topics Routes ---
router.post('/topics/reorder', protect, authorize('author', 'admin'), reorderTopics);
router.post('/topics', protect, authorize('author', 'admin'), createTopic);
router.get('/topics', getTopics);
router.get('/topics/:slug', getTopicBySlug);
router.put('/topics/:id', protect, authorize('author', 'admin'), updateTopic);
router.delete('/topics/:id', protect, authorize('admin'), deleteTopic);

module.exports = router;
