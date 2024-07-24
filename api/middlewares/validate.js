import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import pickKeys from '../utils/pickKeys.js';
import Joi from 'joi';

const validateReq = (schema) => (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  };
  // get keys that are needed to validate from objectToValidate
  const validSchema = pickKeys(schema, ['params', 'query', 'body']);
  const objectToValidate = pickKeys(req, Object.keys(validSchema));

  // Joi.compile convert object to Joi object
  const { value, error } = Joi.compile(validSchema).validate(objectToValidate, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.reduce((errorMessages, key) => {
      errorMessages.push(key.message);
      return errorMessages;
    }, []);
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessages));
  }
  Object.assign(req, value);
  return next();
};

const validateToken = (schema) => (req, res, next) => {
  const checkToken = req.headers.authorization.split(' ');
  if (checkToken[0] === 'Bearer') {
    const token = checkToken[1]; // Joi.compile convert object to Joi object
    const { value, error } = Joi.compile(schema).validate(token, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'))
    }
  }
  return next();
};

export { validateReq, validateToken };