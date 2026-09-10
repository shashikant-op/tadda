const cloudinary = require('cloudinary').v2;

// Keep CLOUDINARY_URL values loaded by the SDK unless explicit credentials exist.
const credentials = {
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET
};
cloudinary.config(Object.fromEntries(
  Object.entries(credentials).filter(([, value]) => value?.trim()).map(([key, value]) => [key, value.trim()])
));

module.exports = cloudinary;
