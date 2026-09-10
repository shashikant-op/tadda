const cloudinary = require('cloudinary').v2;

// The SDK reads CLOUDINARY_URL lazily. Do not call config({}) when no explicit
// variables are present: doing so can clear the URL-based configuration.
const credentials = {
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET
};
const explicitCredentials = Object.fromEntries(
  Object.entries(credentials)
    .filter(([, value]) => typeof value === 'string' && value.trim())
    .map(([key, value]) => [key, value.trim()])
);

if (Object.keys(explicitCredentials).length > 0) {
  cloudinary.config(explicitCredentials);
}

module.exports = cloudinary;
