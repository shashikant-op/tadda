const User = require('../models/User');
const { updateProfileSchema, changePasswordSchema } = require('../validators/user.validator');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedTutorials');
    res.status(200).json(new ApiResponse(200, 'Profile fetched successfully', { user }));
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { name, bio, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar !== undefined && { avatar }) },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(new ApiResponse(200, 'Profile updated successfully', { user: updatedUser }));
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json(new ApiResponse(200, 'Password updated successfully', null));
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
