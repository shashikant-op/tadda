const Joi = require('joi');

const createTutorialSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required(),
  content: Joi.string().required(),
  branch: Joi.string().required(),
  subject: Joi.string().required(),
  topic: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
  video: Joi.object({
    url: Joi.string().allow(''),
    platform: Joi.string().default('youtube')
  }),
  codeBlocks: Joi.array().items(
    Joi.object({
      language: Joi.string().required(),
      code: Joi.string().required()
    })
  ),
  quiz: Joi.string().allow(null, ''),
  seo: Joi.object({
    title: Joi.string().allow(''),
    description: Joi.string().allow(''),
    keywords: Joi.array().items(Joi.string())
  }),
  order: Joi.number().optional(),
  status: Joi.string().valid('draft', 'published')
});

const updateTutorialSchema = createTutorialSchema.fork(
  ['title', 'description', 'content', 'branch', 'subject', 'topic'],
  (schema) => schema.optional()
);

module.exports = { createTutorialSchema, updateTutorialSchema };
