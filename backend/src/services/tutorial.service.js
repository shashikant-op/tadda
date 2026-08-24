const Tutorial = require('../models/Tutorial');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { generateSlug } = require('../utils/slug');
const ApiError = require('../utils/ApiError');

const validateTutorialHierarchy = async ({ branch, subject, topic }) => {
  if (!branch || !subject || !topic) return;

  const [matchingSubject, matchingTopic] = await Promise.all([
    Subject.exists({ _id: subject, branch }),
    Topic.exists({ _id: topic, subject })
  ]);

  if (!matchingSubject || !matchingTopic) {
    throw new ApiError(400, 'Branch, subject, and topic must belong to the same hierarchy');
  }
};

const createTutorialService = async (data, authorId) => {
  await validateTutorialHierarchy(data);
  const slug = generateSlug(data.title);
  const existing = await Tutorial.findOne({ slug });
  if (existing) {
    data.slug = `${slug}-${Date.now()}`;
  } else {
    data.slug = slug;
  }

  data.author = authorId;
  const lastTutorial = await Tutorial.findOne({ subject: data.subject }).sort({ order: -1, createdAt: -1 }).select('order');
  data.order = Number.isFinite(lastTutorial?.order) ? lastTutorial.order + 1 : 0;
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

  await validateTutorialHierarchy({
    branch: data.branch || tutorial.branch,
    subject: data.subject || tutorial.subject,
    topic: data.topic || tutorial.topic
  });

  if (data.title && data.title !== tutorial.title) {
    const baseSlug = generateSlug(data.title);
    const existing = await Tutorial.findOne({ slug: baseSlug, _id: { $ne: tutorialId } }).select('_id');
    data.slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
  }

  const updated = await Tutorial.findByIdAndUpdate(tutorialId, data, { new: true, runValidators: true });
  return updated;
};

module.exports = { createTutorialService, updateTutorialService, validateTutorialHierarchy };
