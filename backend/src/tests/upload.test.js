jest.mock('../config/cloudinary', () => ({
  uploader: { upload_stream: jest.fn() }
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn(() => ({ pipe: jest.fn() }))
}));

const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../services/upload.service');
const { hasSupportedImageSignature } = require('../middleware/upload.middleware');

describe('upload service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns the Cloudinary secure URL', async () => {
    cloudinary.uploader.upload_stream.mockImplementation((_options, callback) => {
      callback(null, { secure_url: 'https://cdn.example.com/image.webp' });
      return {};
    });

    await expect(uploadToCloudinary(Buffer.from('image')))
      .resolves.toBe('https://cdn.example.com/image.webp');
  });

  test('reports provider failures instead of returning a data URL', async () => {
    cloudinary.uploader.upload_stream.mockImplementation((_options, callback) => {
      callback(new Error('provider unavailable'));
      return {};
    });

    await expect(uploadToCloudinary(Buffer.from('image')))
      .rejects.toMatchObject({ statusCode: 502, message: 'Image upload failed' });
  });
});

describe('image signature validation', () => {
  test('accepts image signatures and rejects spoofed text', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(hasSupportedImageSignature(jpeg)).toBe(true);
    expect(hasSupportedImageSignature(Buffer.from('not really an image'))).toBe(false);
  });
});
