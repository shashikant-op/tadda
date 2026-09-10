jest.mock('../config/cloudinary', () => ({
  config: jest.fn(() => ({ cloud_name: 'test', api_key: 'test', api_secret: 'test' })),
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
      return { on: jest.fn(), end: jest.fn(), destroy: jest.fn() };
    });

    await expect(uploadToCloudinary(Buffer.from('image')))
      .resolves.toBe('https://cdn.example.com/image.webp');
  });

  test('reports provider failures instead of returning a data URL', async () => {
    cloudinary.uploader.upload_stream.mockImplementation((_options, callback) => {
      callback(new Error('provider unavailable'));
      return { on: jest.fn(), end: jest.fn(), destroy: jest.fn() };
    });

    await expect(uploadToCloudinary(Buffer.from('image')))
      .rejects.toMatchObject({ statusCode: 502, message: 'Image storage is temporarily unavailable. Please try again.' });
  });

  test('rejects missing configuration before starting an upload', async () => {
    cloudinary.config.mockReturnValueOnce({});
    await expect(uploadToCloudinary(Buffer.from('image'))).rejects.toMatchObject({ statusCode: 503 });
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  test('identifies invalid provider credentials without exposing provider details', async () => {
    cloudinary.uploader.upload_stream.mockImplementation(() => { throw { http_code: 401, message: 'secret' }; });
    await expect(uploadToCloudinary(Buffer.from('image'))).rejects.toMatchObject({
      statusCode: 503,
      message: 'Image storage authentication failed. Please check the server Cloudinary credentials.'
    });
  });

  test('handles stream errors', async () => {
    const { PassThrough } = require('stream');
    const stream = new PassThrough();
    cloudinary.uploader.upload_stream.mockReturnValue(stream);
    const result = uploadToCloudinary(Buffer.from('image'));
    stream.emit('error', new Error('connection reset'));
    await expect(result).rejects.toMatchObject({ statusCode: 502 });
  });

  test('allows uploads beyond six seconds and destroys stalled streams at the deadline', async () => {
    jest.useFakeTimers();
    try {
      const stream = { on: jest.fn(), end: jest.fn(), destroy: jest.fn() };
      cloudinary.uploader.upload_stream.mockReturnValue(stream);
      const result = uploadToCloudinary(Buffer.from('image'));
      const assertion = expect(result).rejects.toMatchObject({ statusCode: 504 });
      jest.advanceTimersByTime(6000);
      expect(stream.destroy).not.toHaveBeenCalled();
      jest.advanceTimersByTime(19000);
      await assertion;
      expect(stream.destroy).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

});

describe('image signature validation', () => {
  test('accepts image signatures and rejects spoofed text', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(hasSupportedImageSignature(jpeg)).toBe(true);
    expect(hasSupportedImageSignature(Buffer.from('not really an image'))).toBe(false);
  });
});
