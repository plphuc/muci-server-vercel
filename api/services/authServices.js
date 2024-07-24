import httpStatus from 'http-status';
import { userServices } from './index.js';
import ApiError from '../utils/ApiError.js';

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userServices.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export { loginWithEmailAndPassword };