const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const ApiError = require('../utils/ApiError');

const uploadToCloudinary = (fileBuffer, mimetype = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = setTimeout(() => {
      settled = true;
      reject(new ApiError(504, 'Image upload timed out'));
    }, 6000);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'tutorialsadda' },
      (error, result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (error) {
          reject(new ApiError(502, 'Image upload failed'));
        } else if (!result?.secure_url) {
          reject(new ApiError(502, 'Image upload returned no URL'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };
