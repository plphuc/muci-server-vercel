import Joi from 'joi';
import { checkPassword } from './customValidation.js';

const tokenSchema = Joi.string().required().invalid('')

const registerSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email().invalid(''),
    password: Joi.string().required().custom(checkPassword),
    name: Joi.string().required().invalid(''),
    username: Joi.string().required().invalid(''),
  }),
};

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email().invalid(''),
    password: Joi.string().required().custom(checkPassword),
  }),
};
export { registerSchema, loginSchema, tokenSchema };