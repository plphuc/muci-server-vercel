import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const createUser = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }
  return await User.create(userData);
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({email})
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not found');
  }
  return user;
}

const getUserById = async (id) => {
  const user = await User.findOne({_id: id})
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user._doc;
}

export { createUser, getUserById, getUserByEmail };