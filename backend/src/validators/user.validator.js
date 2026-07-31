const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500),
  avatar: Joi.string().uri()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6)
});

module.exports = { updateProfileSchema, changePasswordSchema };
