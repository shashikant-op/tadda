const mongoose = require('mongoose');
const Tutorial = require('../models/Tutorial');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Bookmark = require('../models/Bookmark');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { createTutorialSchema, updateTutorialSchema } = require('../validators/tutorial.validator');
const { createTutorialService, updateTutorialService } = require('../services/tutorial.service');
const { uploadToCloudinary } = require('../services/upload.service');
const { getPagination, getPaginationResult } = require('../utils/pagination');
const { escapeRegex } = require('../utils/regex');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { hasSupportedImageSignature } = require('../middleware/upload.middleware');
const { invalidateHomeCache } = require('../utils/homeCache');

const EMBEDDED_IMAGE_PATTERN = /data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)/g;

const externalizeContentImages = (content, tutorialId) => {
  let index = 0;
  return content.replace(EMBEDDED_IMAGE_PATTERN, () => {
    const imageUrl = `/api/v1/tutorials/${tutorialId}/content-images/${index}`;
    index += 1;
    return imageUrl;
  });
};

const createTutorial = async (req, res, next) => {
  try {
    const { error } = createTutorialSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const tutorial = await createTutorialService(req.body, req.user._id);
    invalidateHomeCache();
    res.status(201).json(new ApiResponse(201, 'Tutorial created successfully', { tutorial }));
  } catch (err) {
    next(err);
  }
};

const getTutorials = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { branch, subject, topic, sort, status } = req.query;
    const summary = req.query.summary === 'true';

    const filter = {};
    if (branch) {
      if (mongoose.Types.ObjectId.isValid(branch)) {
        filter.branch = branch;
      } else {
        const foundBranch = await Branch.findOne({ slug: branch });
        filter.branch = foundBranch ? foundBranch._id : null;
      }
    }
    if (subject) {
      if (mongoose.Types.ObjectId.isValid(subject)) {
        filter.subject = subject;
      } else {
        const foundSubject = await Subject.findOne({
          slug: subject,
          ...(filter.branch ? { branch: filter.branch } : {})
        });
        filter.subject = foundSubject ? foundSubject._id : null;
      }
    }
    if (topic) {
      if (mongoose.Types.ObjectId.isValid(topic)) {
        filter.topic = topic;
      } else {
        const foundTopic = await Topic.findOne({ slug: topic });
        filter.topic = foundTopic ? foundTopic._id : null;
      }
    }
    if (req.user?.role === 'admin' && ['draft', 'published'].includes(status)) {
      filter.status = status;
    } else if (req.user?.role !== 'admin' || status !== 'all') {
      filter.status = 'published';
    }

    let sortOption = { order: 1, createdAt: 1 };
    if (sort === 'oldest') sortOption = { order: 1, createdAt: 1 };
    if (sort === 'popular') sortOption = { order: 1, views: -1 };

    let tutorialsQuery = Tutorial.find(filter);
    if (summary) {
      tutorialsQuery = tutorialsQuery.select('_id title slug description branch subject topic order createdAt');
    }
    tutorialsQuery = tutorialsQuery
      .populate([
        { path: 'branch subject', select: 'name slug' },
        ...(summary ? [] : [{ path: 'author', select: 'name slug email avatar' }]),
        { path: 'topic', select: 'name slug order' }
      ])
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const [total, tutorials] = await Promise.all([
      Tutorial.countDocuments(filter),
      tutorialsQuery
    ]);

    const result = getPaginationResult(total, page, limit, tutorials);
    res.status(200).json(new ApiResponse(200, 'Tutorials fetched successfully', result));
  } catch (err) {
    next(err);
  }
};

const searchTutorials = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (typeof q !== 'string' || !q.trim()) {
      throw new ApiError(400, 'Search query "q" is required');
    }
    const searchTerm = q.trim();
    if (searchTerm.length > 100) {
      throw new ApiError(400, 'Search query must be 100 characters or fewer');
    }
    const { page, limit, skip } = getPagination(req.query);

    const regex = new RegExp(escapeRegex(searchTerm), 'i');

    // Find matching branches, subjects (courses), and topics case-insensitively
    const [matchingBranches, matchingSubjects, matchingTopics] = await Promise.all([
      Branch.find({ name: regex }).select('_id'),
      Subject.find({ name: regex }).select('_id'),
      Topic.find({ name: regex }).select('_id'),
    ]);

    const branchIds = matchingBranches.map(b => b._id);
    const subjectIds = matchingSubjects.map(s => s._id);
    const topicIds = matchingTopics.map(t => t._id);

    // Global query matching title, description, or parent branch/subject/topic names
    const query = {
      status: 'published',
      $or: [
        { title: regex },
        { description: regex },
        ...(branchIds.length > 0 ? [{ branch: { $in: branchIds } }] : []),
        ...(subjectIds.length > 0 ? [{ subject: { $in: subjectIds } }] : []),
        ...(topicIds.length > 0 ? [{ topic: { $in: topicIds } }] : []),
      ],
    };

    const total = await Tutorial.countDocuments(query);
    const tutorials = await Tutorial.find(query)
      .populate('branch subject topic author', 'name slug email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = getPaginationResult(total, page, limit, tutorials).pagination;
    res.status(200).json(new ApiResponse(200, 'Search results fetched successfully', { tutorials, pagination }));
  } catch (err) {
    next(err);
  }
};

const getTutorialBySlug = async (req, res, next) => {
  try {
    const identifier = req.params.slug;
    const isEditRequest = req.query.edit === 'true';
    const isPrefetchRequest = req.query.prefetch === 'true';
    if (isEditRequest && (!req.user || !['author', 'admin'].includes(req.user.role))) {
      throw new ApiError(401, 'Authentication is required to edit tutorials');
    }

    let query = { slug: identifier, ...(isEditRequest ? {} : { status: 'published' }) };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = {
        $or: [{ _id: identifier }, { slug: identifier }],
        ...(isEditRequest ? {} : { status: 'published' })
      };
    }
    const tutorial = await Tutorial.findOne(query)
      .populate('branch', 'name slug')
      .populate('subject', 'name slug branch')
      .populate('topic', 'name slug order subject')
      .populate('author', 'name email avatar role')
      .populate('relatedTutorials', 'title slug description branch subject topic')
      .populate({ path: 'quiz', select: '-questions.correctAnswer' })
      .lean();

    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    if (isEditRequest && req.user.role !== 'admin' && tutorial.author._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to edit this tutorial');
    }

    if (!isEditRequest) {
      tutorial.content = externalizeContentImages(tutorial.content, tutorial._id);
      if (!isPrefetchRequest) {
        Tutorial.updateOne({ _id: tutorial._id }, { $inc: { views: 1 } })
          .catch((error) => console.error(`Failed to increment tutorial views: ${error.message}`));
      }
    }

    res.status(200).json(new ApiResponse(200, 'Tutorial fetched successfully', { tutorial }));
  } catch (err) {
    next(err);
  }
};

const getTutorialContentImage = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(404, 'Tutorial image not found');
    }
    const requestedIndex = Number.parseInt(req.params.index, 10);
    if (!Number.isInteger(requestedIndex) || requestedIndex < 0 || requestedIndex > 50) {
      throw new ApiError(404, 'Tutorial image not found');
    }

    const tutorial = await Tutorial.findById(req.params.id).select('content').lean();
    if (!tutorial) throw new ApiError(404, 'Tutorial image not found');

    const matches = [...tutorial.content.matchAll(EMBEDDED_IMAGE_PATTERN)];
    const match = matches[requestedIndex];
    if (!match) throw new ApiError(404, 'Tutorial image not found');

    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.type(match[1]).send(Buffer.from(match[2], 'base64'));
  } catch (err) {
    next(err);
  }
};

const updateTutorial = async (req, res, next) => {
  try {
    const { error } = updateTutorialSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const tutorial = await updateTutorialService(req.params.id, req.body, req.user._id, req.user.role);
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Tutorial updated successfully', { tutorial }));
  } catch (err) {
    next(err);
  }
};

const deleteTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    if (req.user.role !== 'admin' && tutorial.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to delete this tutorial');
    }

    await Promise.all([
      Quiz.deleteMany({ tutorial: tutorial._id }),
      Bookmark.deleteMany({ tutorial: tutorial._id }),
      Progress.deleteMany({ tutorial: tutorial._id }),
      User.updateMany({}, { $pull: { savedTutorials: tutorial._id } }),
      Tutorial.updateMany({ relatedTutorials: tutorial._id }, { $pull: { relatedTutorials: tutorial._id } })
    ]);
    await tutorial.deleteOne();
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Tutorial deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

const publishTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    if (req.user.role !== 'admin' && tutorial.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to publish this tutorial');
    }

    tutorial.status = tutorial.status === 'published' ? 'draft' : 'published';
    await tutorial.save();
    invalidateHomeCache();

    res.status(200).json(new ApiResponse(200, `Tutorial status updated to ${tutorial.status}`, { tutorial }));
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload an image file');
    }
    if (!hasSupportedImageSignature(req.file.buffer)) {
      throw new ApiError(400, 'Uploaded file content is not a supported image');
    }

    const url = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    res.status(200).json(new ApiResponse(200, 'Image uploaded successfully', { url }));
  } catch (err) {
    next(err);
  }
};

const getAuthorTutorials = async (req, res, next) => {
  try {
    const tutorials = await Tutorial.find({ author: req.user._id })
      .populate('branch subject topic author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, 'Author tutorials fetched successfully', { tutorials }));
  } catch (err) {
    next(err);
  }
};

const reorderTutorials = async (req, res, next) => {
  try {
    const { tutorialIds } = req.body;
    if (!Array.isArray(tutorialIds) || tutorialIds.length === 0) {
      throw new ApiError(400, 'tutorialIds must be a non-empty array');
    }

    if (tutorialIds.some((id) => !mongoose.Types.ObjectId.isValid(id)) || new Set(tutorialIds).size !== tutorialIds.length) {
      throw new ApiError(400, 'tutorialIds must contain unique valid IDs');
    }

    const ownershipFilter = {
      _id: { $in: tutorialIds },
      ...(req.user.role === 'admin' ? {} : { author: req.user._id })
    };
    const allowedCount = await Tutorial.countDocuments(ownershipFilter);
    if (allowedCount !== tutorialIds.length) {
      throw new ApiError(403, 'Not authorized to reorder one or more tutorials');
    }

    const result = await Tutorial.bulkWrite(tutorialIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, ...(req.user.role === 'admin' ? {} : { author: req.user._id }) },
        update: { $set: { order: index } }
      }
    })));
    if (result.matchedCount !== tutorialIds.length) {
      throw new ApiError(409, 'One or more tutorials changed before the order was saved');
    }

    const persistedTutorials = await Tutorial.find({ _id: { $in: tutorialIds } })
      .select('_id title topic order')
      .sort({ order: 1 });

    res.status(200).json(new ApiResponse(200, 'Tutorials reordered successfully', { tutorials: persistedTutorials }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTutorial, getTutorials, searchTutorials, getTutorialBySlug,
  getTutorialContentImage, updateTutorial, deleteTutorial, publishTutorial, uploadImage, getAuthorTutorials, reorderTutorials
};
