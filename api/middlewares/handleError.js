import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Convert error to ApiError
 * create message and  status code
 */
const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    err.statusCode =
      err.statusCode || err.statusCode instanceof mongoose.Error
        ? err.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    err.message = err.message || httpStatus[err.statusCode];
  }
  const error = new ApiError(err.statusCode, err.message, false, err.stack);
  next(error);
};

/**
 * Handle error
 * Send status code, error message, stack trace to client
 */
const errorHandler = (err, req, res, next) => {
  const { message, statusCode, stack } = err;
  const response = {
    code: statusCode,
    message,
    stack: stack,
  };

  res.status(statusCode).send(response);
};

export { errorHandler, errorConverter };