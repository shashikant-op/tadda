const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const addBookmark = async (req, res, next) => {
  try {
    const tutorialId = req.params.tutorialId;
    
    const existing = await Bookmark.findOne({ user: req.user._id, tutorial: tutorialId });
    if (existing) {
      throw new ApiError(400, 'Tutorial already bookmarked');
    }

    const bookmark = await Bookmark.create({ user: req.user._id, tutorial: tutorialId });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedTutorials: tutorialId } });

    res.status(201).json(new ApiResponse(201, 'Bookmark added successfully', { bookmark }));
  } catch (err) {
    next(err);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const tutorialId = req.params.tutorialId;
    const bookmark = await Bookmark.findOneAndDelete({ user: req.user._id, tutorial: tutorialId });
    if (!bookmark) {
      throw new ApiError(404, 'Bookmark not found');
    }

    await User.findByIdAndUpdate(req.user._id, { $pull: { savedTutorials: tutorialId } });

    res.status(200).json(new ApiResponse(200, 'Bookmark removed successfully', null));
  } catch (err) {
    next(err);
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate({
      path: 'tutorial',
      populate: { path: 'branch subject topic author', name: 'name email' }
    });
    res.status(200).json(new ApiResponse(200, 'Bookmarks fetched successfully', { bookmarks }));
  } catch (err) {
    next(err);
  }
};

module.exports = { addBookmark, removeBookmark, getBookmarks };
