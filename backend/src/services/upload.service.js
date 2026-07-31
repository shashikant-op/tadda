const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const ApiError = require('../utils/ApiError');

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'tutorialsadda' },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'Cloudinary upload failed: ' + error.message));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };
