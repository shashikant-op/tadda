const Tutorial = require('../models/Tutorial');
const { generateSlug } = require('../utils/slug');
const ApiError = require('../utils/ApiError');

const createTutorialService = async (data, authorId) => {
  const slug = generateSlug(data.title);
  const existing = await Tutorial.findOne({ slug });
  if (existing) {
    data.slug = `${slug}-${Date.now()}`;
  } else {
    data.slug = slug;
  }

  data.author = authorId;
  const tutorial = await Tutorial.create(data);
  return tutorial;
};

const updateTutorialService = async (tutorialId, data, userId, userRole) => {
  const tutorial = await Tutorial.findById(tutorialId);
  if (!tutorial) {
    throw new ApiError(404, 'Tutorial not found');
  }

  if (userRole !== 'admin' && tutorial.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to update this tutorial');
  }

  if (data.title && data.title !== tutorial.title) {
    data.slug = generateSlug(data.title);
  }

  const updated = await Tutorial.findByIdAndUpdate(tutorialId, data, { new: true, runValidators: true });
  return updated;
};

module.exports = { createTutorialService, updateTutorialService };
