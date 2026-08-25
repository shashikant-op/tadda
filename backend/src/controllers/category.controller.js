const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Tutorial = require('../models/Tutorial');
const { generateSlug } = require('../utils/slug');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { invalidateHomeCache } = require('../utils/homeCache');

// --- Branch Controllers ---
const createBranch = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const slug = generateSlug(name);

    const existing = await Branch.findOne({ slug });
    if (existing) {
      throw new ApiError(400, 'Branch with this name already exists');
    }

    const branch = await Branch.create({ name, slug, description, image });
    invalidateHomeCache();
    res.status(201).json(new ApiResponse(201, 'Branch created successfully', { branch }));
  } catch (err) {
    next(err);
  }
};

const getBranchImage = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(404, 'Branch image not found');
    }
    const branch = await Branch.findById(req.params.id).select('image').lean();
    if (!branch?.image?.startsWith('data:')) {
      throw new ApiError(404, 'Branch image not found');
    }

    const match = branch.image.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/s);
    if (!match) throw new ApiError(415, 'Branch image format is not supported');

    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.type(match[1]).send(Buffer.from(match[2], 'base64'));
  } catch (err) {
    next(err);
  }
};

const getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find({});
    res.status(200).json(new ApiResponse(200, 'Branches fetched successfully', { branches }));
  } catch (err) {
    next(err);
  }
};

const getBranchBySlug = async (req, res, next) => {
  try {
    const branch = await Branch.findOne({ slug: req.params.slug });
    if (!branch) {
      throw new ApiError(404, 'Branch not found');
    }
    res.status(200).json(new ApiResponse(200, 'Branch fetched successfully', { branch }));
  } catch (err) {
    next(err);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const updateData = { ...(name && { name, slug: generateSlug(name) }), ...(description !== undefined && { description }), ...(image !== undefined && { image }) };

    const branch = await Branch.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!branch) {
      throw new ApiError(404, 'Branch not found');
    }
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Branch updated successfully', { branch }));
  } catch (err) {
    next(err);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const childCount = await Subject.countDocuments({ branch: req.params.id });
    if (childCount > 0) {
      throw new ApiError(409, 'Delete or move this branch\'s subjects before deleting the branch');
    }
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      throw new ApiError(404, 'Branch not found');
    }
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Branch deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

// --- Subject Controllers ---
const createSubject = async (req, res, next) => {
  try {
    const { name, branch, description } = req.body;
    const slug = generateSlug(name);

    const subject = await Subject.create({ name, slug, branch, description });
    invalidateHomeCache();
    res.status(201).json(new ApiResponse(201, 'Subject created successfully', { subject }));
  } catch (err) {
    next(err);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const filter = req.query.branch ? { branch: req.query.branch } : {};
    const subjects = await Subject.find(filter).populate('branch');
    res.status(200).json(new ApiResponse(200, 'Subjects fetched successfully', { subjects }));
  } catch (err) {
    next(err);
  }
};

const getSubjectBySlug = async (req, res, next) => {
  try {
    const filter = { slug: req.params.slug };
    if (req.query.branch) {
      if (mongoose.Types.ObjectId.isValid(req.query.branch)) {
        filter.branch = req.query.branch;
      } else {
        const branch = await Branch.findOne({ slug: req.query.branch }).select('_id');
        filter.branch = branch ? branch._id : null;
      }
    }
    const subject = await Subject.findOne(filter).populate('branch');
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }
    res.status(200).json(new ApiResponse(200, 'Subject fetched successfully', { subject }));
  } catch (err) {
    next(err);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { name, description, branch } = req.body;
    const updateData = { ...(name && { name, slug: generateSlug(name) }), ...(description !== undefined && { description }), ...(branch && { branch }) };

    const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Subject updated successfully', { subject }));
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const childCount = await Topic.countDocuments({ subject: req.params.id });
    if (childCount > 0) {
      throw new ApiError(409, 'Delete or move this subject\'s topics before deleting the subject');
    }
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }
    invalidateHomeCache();
    res.status(200).json(new ApiResponse(200, 'Subject deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

// --- Topic Controllers ---
const createTopic = async (req, res, next) => {
  try {
    const { name, subject, description } = req.body;
    const slug = generateSlug(name);
    const lastTopic = await Topic.findOne({ subject }).sort({ order: -1, createdAt: -1 }).select('order');
    const order = Number.isFinite(lastTopic?.order) ? lastTopic.order + 1 : 0;

    const topic = await Topic.create({ name, slug, subject, description, order });
    res.status(201).json(new ApiResponse(201, 'Topic created successfully', { topic }));
  } catch (err) {
    next(err);
  }
};

const getTopics = async (req, res, next) => {
  try {
    const filter = req.query.subject ? { subject: req.query.subject } : {};
    const topics = await Topic.find(filter)
      .populate({ path: 'subject', populate: { path: 'branch' } })
      .sort({ order: 1, createdAt: 1 });
    res.status(200).json(new ApiResponse(200, 'Topics fetched successfully', { topics }));
  } catch (err) {
    next(err);
  }
};

const getTopicBySlug = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug }).populate({ path: 'subject', populate: { path: 'branch' } });
    if (!topic) {
      throw new ApiError(404, 'Topic not found');
    }
    res.status(200).json(new ApiResponse(200, 'Topic fetched successfully', { topic }));
  } catch (err) {
    next(err);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const { name, description, subject } = req.body;
    const updateData = { ...(name && { name, slug: generateSlug(name) }), ...(description !== undefined && { description }), ...(subject && { subject }) };

    const topic = await Topic.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!topic) {
      throw new ApiError(404, 'Topic not found');
    }
    res.status(200).json(new ApiResponse(200, 'Topic updated successfully', { topic }));
  } catch (err) {
    next(err);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      throw new ApiError(404, 'Topic not found');
    }

    const tutorialCount = await Tutorial.countDocuments({ topic: topic._id });
    if (tutorialCount > 0) {
      throw new ApiError(409, 'Delete or move this topic\'s tutorials before deleting the topic');
    }
    await topic.deleteOne();

    res.status(200).json(new ApiResponse(200, 'Topic deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

const reorderTopics = async (req, res, next) => {
  try {
    const { topicIds } = req.body;
    if (!Array.isArray(topicIds) || topicIds.length === 0) {
      throw new ApiError(400, 'topicIds must be a non-empty array');
    }
    if (topicIds.some((id) => !mongoose.Types.ObjectId.isValid(id)) || new Set(topicIds).size !== topicIds.length) {
      throw new ApiError(400, 'topicIds must contain unique valid IDs');
    }

    const topics = await Topic.find({ _id: { $in: topicIds } }).select('subject');
    if (topics.length !== topicIds.length || new Set(topics.map((topic) => topic.subject.toString())).size !== 1) {
      throw new ApiError(400, 'All topics must exist and belong to the same subject');
    }

    const result = await Topic.bulkWrite(topicIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    })));
    if (result.matchedCount !== topicIds.length) {
      throw new ApiError(409, 'One or more topics changed before the order was saved');
    }

    const persistedTopics = await Topic.find({ _id: { $in: topicIds } })
      .select('_id name order')
      .sort({ order: 1 });

    res.status(200).json(new ApiResponse(200, 'Topics reordered successfully', { topics: persistedTopics }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBranch, getBranches, getBranchImage, getBranchBySlug, updateBranch, deleteBranch,
  createSubject, getSubjects, getSubjectBySlug, updateSubject, deleteSubject,
  createTopic, getTopics, getTopicBySlug, updateTopic, deleteTopic, reorderTopics
};
