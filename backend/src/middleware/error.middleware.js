const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = 'Internal Server Error' } = err;

  if (!(err instanceof ApiError)) {
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Resource not found. Invalid: ${err.path}`;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(', ');
    }
  }

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.errors && { errors: err.errors })
  };

  res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
