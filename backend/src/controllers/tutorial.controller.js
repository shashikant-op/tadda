const Tutorial = require('../models/Tutorial');
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
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
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

    const tutorials = await Tutorial.find(
      { $text: { $search: q }, status: 'published' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('branch subject topic author', 'name email');

    res.status(200).json(new ApiResponse(200, 'Search results fetched successfully', { tutorials }));
  } catch (err) {
    next(err);
  }
};

const getTutorialBySlug = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findOne({ slug: req.params.slug })
      .populate('branch subject topic author quiz relatedTutorials');

    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    // Increment views
    tutorial.views += 1;
    await tutorial.save();

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

    const url = await uploadToCloudinary(req.file.buffer);
    res.status(200).json(new ApiResponse(200, 'Image uploaded successfully', { url }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTutorial, getTutorials, searchTutorials, getTutorialBySlug,
  updateTutorial, deleteTutorial, publishTutorial, uploadImage
};
