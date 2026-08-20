const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { generateSlug } = require('../utils/slug');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

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
    res.status(201).json(new ApiResponse(201, 'Branch created successfully', { branch }));
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
    res.status(200).json(new ApiResponse(200, 'Branch updated successfully', { branch }));
  } catch (err) {
    next(err);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      throw new ApiError(404, 'Branch not found');
    }
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
    const subject = await Subject.findOne({ slug: req.params.slug }).populate('branch');
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
    res.status(200).json(new ApiResponse(200, 'Subject updated successfully', { subject }));
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }
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

    const topic = await Topic.create({ name, slug, subject, description });
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
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      throw new ApiError(404, 'Topic not found');
    }
    res.status(200).json(new ApiResponse(200, 'Topic deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

const reorderTopics = async (req, res, next) => {
  try {
    const { topicIds } = req.body;
    if (!Array.isArray(topicIds)) {
      throw new ApiError(400, 'topicIds must be an array');
    }

    const updatePromises = topicIds.map((id, index) =>
      Topic.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updatePromises);

    res.status(200).json(new ApiResponse(200, 'Topics reordered successfully', null));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBranch, getBranches, getBranchBySlug, updateBranch, deleteBranch,
  createSubject, getSubjects, getSubjectBySlug, updateSubject, deleteSubject,
  createTopic, getTopics, getTopicBySlug, updateTopic, deleteTopic, reorderTopics
};
