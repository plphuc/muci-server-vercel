import catchAsync from '../utils/catchAsync.js';
import {
  authServices,
  tokenServices,
  userServices,
} from '../services/index.js';
import httpStatus from 'http-status';
import getTokenFromHeader from '../utils/getTokenFromHeader.js';
import tokenTypes from '../config/token.js';

const register = catchAsync(async (req, res) => {
  const user = await userServices.createUser(req.body);
  const tokens = tokenServices.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({ tokens, acknowledged: true });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.loginWithEmailAndPassword(email, password);
  const tokens = tokenServices.generateAuthTokens(user.id);
  res.status(httpStatus.OK).send({ tokens, acknowledged: true });
});

// If rftk has not expired, generate new access token
const generateAccessToken = (req, res) => {
  const refreshToken = getTokenFromHeader(req);
  const userId = tokenServices.verifyToken(refreshToken);
  const accessToken = tokenServices.generateToken(userId, tokenTypes.ACCESS);
  res.status(httpStatus.OK).send({ accessToken, acknowledged: true });
};

export { register, login, generateAccessToken };