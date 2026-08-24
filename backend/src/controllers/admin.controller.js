const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalTutorials, totalBranches, totalSubjects, totalTopics, activeAuthors] = await Promise.all([
      User.countDocuments(),
      Tutorial.countDocuments(),
      Branch.countDocuments(),
      Subject.countDocuments(),
      Topic.countDocuments(),
      User.countDocuments({ role: 'author' })
    ]);

    const popularTutorials = await Tutorial.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views');

    res.status(200).json(new ApiResponse(200, 'Analytics fetched successfully', {
      stats: {
        totalUsers,
        totalTutorials,
        totalBranches,
        totalSubjects,
        totalTopics,
        activeAuthors
      },
      popularTutorials
    }));
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(new ApiResponse(200, 'Users fetched successfully', { users }));
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'author', 'admin'].includes(role)) {
      throw new ApiError(400, 'Invalid role');
    }
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      throw new ApiError(409, 'Administrators cannot remove their own admin role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, 'User role updated successfully', { user }));
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      throw new ApiError(409, 'Administrators cannot delete their own account');
    }
    const authoredTutorials = await Tutorial.countDocuments({ author: req.params.id });
    if (authoredTutorials > 0) {
      throw new ApiError(409, 'Reassign or delete this user\'s tutorials before deleting the account');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, 'User deleted successfully', null));
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getUsers, updateUserRole, deleteUser };
