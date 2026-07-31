const Progress = require('../models/Progress');
const Tutorial = require('../models/Tutorial');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const markProgressCompleted = async (req, res, next) => {
  try {
    const tutorialId = req.params.tutorialId;
    const tutorial = await Tutorial.findById(tutorialId);
    if (!tutorial) {
      throw new ApiError(404, 'Tutorial not found');
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, tutorial: tutorialId },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json(new ApiResponse(200, 'Tutorial progress marked completed', { progress }));
  } catch (err) {
    next(err);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const progressList = await Progress.find({ user: req.user._id }).populate({
      path: 'tutorial',
      select: 'title slug branch subject topic'
    });

    const totalTutorials = await Tutorial.countDocuments({ status: 'published' });
    const completedCount = progressList.filter(p => p.completed).length;
    const percentage = totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0;

    res.status(200).json(new ApiResponse(200, 'Learning progress fetched successfully', {
      progress: progressList,
      stats: {
        totalTutorials,
        completedCount,
        percentage
      }
    }));
  } catch (err) {
    next(err);
  }
};

module.exports = { markProgressCompleted, getProgress };
