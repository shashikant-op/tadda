const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const ApiError = require('../utils/ApiError');

const uploadToCloudinary = (fileBuffer, mimetype = 'image/jpeg') => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      const base64 = fileBuffer.toString('base64');
      resolve(`data:${mimetype};base64,${base64}`);
    }, 6000);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'tutorialsadda' },
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          const base64 = fileBuffer.toString('base64');
          resolve(`data:${mimetype};base64,${base64}`);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };
