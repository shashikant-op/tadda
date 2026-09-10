const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const UPLOAD_TIMEOUT_MS = 25000;

const providerError = (error) => {
  const code = Number(error.http_code);
  if (code === 401 || code === 403) {
    return new ApiError(503, 'Image storage authentication failed. Please check the server Cloudinary credentials.');
  }
  if (code === 400) {
    return new ApiError(400, 'Image storage rejected the image. Please try a different JPG, PNG or WebP file.');
  }
  if (code === 408 || error.code === 'ETIMEDOUT') {
    return new ApiError(504, 'Image upload timed out. Please try again.');
  }
  return new ApiError(502, 'Image storage is temporarily unavailable. Please try again.');
};

const uploadToCloudinary = (fileBuffer) => {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    return Promise.reject(new ApiError(503, 'Image storage is not configured. Please configure Cloudinary on the server.'));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let uploadStream;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(result);
    };
    const timeout = setTimeout(() => {
      finish(new ApiError(504, 'Image upload timed out. Please try again.'));
      uploadStream?.destroy();
    }, UPLOAD_TIMEOUT_MS);

    try {
      uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'tutorialsadda', resource_type: 'image', timeout: UPLOAD_TIMEOUT_MS },
        (error, result) => {
          if (error) finish(providerError(error));
          else if (!result?.secure_url) finish(new ApiError(502, 'Image upload returned no URL'));
          else finish(null, result.secure_url);
        }
      );
      uploadStream.on('error', (error) => finish(providerError(error)));
      if (!settled) uploadStream.end(fileBuffer);
    } catch (error) {
      finish(providerError(error));
      uploadStream?.destroy();
    }
  });
};

module.exports = { uploadToCloudinary };
