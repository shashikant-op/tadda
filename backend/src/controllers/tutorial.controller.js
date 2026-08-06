const mongoose = require('mongoose');
const Tutorial = require('../models/Tutorial');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { createTutorialSchema, updateTutorialSchema } = require('../validators/tutorial.validator');
const { createTutorialService, updateTutorialService } = require('../services/tutorial.service');
const { uploadToCloudinary } = require('../services/upload.service');
const { getPagination, getPaginationResult } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const createTutorial = async (req, res, next) => {
  try {
    const { error } = createTutorialSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const tutorial = await createTutorialService(req.body, req.user._id);
    res.status(201).json(new ApiResponse(201, 'Tutorial created successfully', { tutorial }));
  } catch (err) {
    next(err);
  }
};

const getTutorials = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { branch, subject, topic, status, sort } = req.query;

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
        const foundSubject = await Subject.findOne({ slug: subject });
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
    if (status) filter.status = status;
    else filter.status = 'published'; // default public view only published unless specified

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'popular') sortOption = { views: -1 };

    const total = await Tutorial.countDocuments(filter);
    const tutorials = await Tutorial.find(filter)
      .populate('branch subject topic author', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const result = getPaginationResult(total, page, limit, tutorials);
    res.status(200).json(new ApiResponse(200, 'Tutorials fetched successfully', result));
  } catch (err) {
    next(err);
  }
};

const searchTutorials = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new ApiError(400, 'Search query "q" is required');
    }

    const regex = new RegExp(q.trim(), 'i');

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

    const tutorials = await Tutorial.find(query)
      .populate('branch subject topic author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, 'Search results fetched successfully', { tutorials }));
  } catch (err) {
    next(err);
  }
};

const getTutorialBySlug = async (req, res, next) => {
  try {
    const identifier = req.params.slug;
    let query = { slug: identifier };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ _id: identifier }, { slug: identifier }] };
    }
    const tutorial = await Tutorial.findOne(query)
      .populate('branch subject topic author quiz relatedTutorials');

    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    if (!req.query.edit) {
      tutorial.views += 1;
      await tutorial.save();
    }

    res.status(200).json(new ApiResponse(200, 'Tutorial fetched successfully', { tutorial }));
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

    await tutorial.deleteOne();
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

module.exports = {
  createTutorial, getTutorials, searchTutorials, getTutorialBySlug,
  updateTutorial, deleteTutorial, publishTutorial, uploadImage, getAuthorTutorials
};
