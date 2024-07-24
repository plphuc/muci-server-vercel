import moment from 'moment';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import tokenTypes from '../config/token.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import getTokenFromHeader from '../utils/getTokenFromHeader.js';

const generateToken = (userId, type, secret = config.secret) => {
  const expireTime =
    type === 'access'
      ? moment().add(config.accessTime, 'minutes')
      : moment().add(config.refreshTime, 'days');

  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expireTime.unix(),
    type,
  };

  return jwt.sign(payload, secret)
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, config.secret, { algorithms: ['HS256'] });
    const currentTime = moment().unix();
    if (currentTime < payload.exp) {
      return payload.sub;
    }
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

const generateAuthTokens = (userId) => {
  // help set expire time, return will calculate from current and expire time
  const accessToken = generateToken(userId, tokenTypes.ACCESS);
  const refreshToken = generateToken(userId, tokenTypes.REFRESH);

  return {
    accessToken,
    refreshToken,
  };
};

const getUserIdByToken = (req) => {
  const tokenReq = getTokenFromHeader(req);
  const userId = verifyToken(tokenReq); 
  return userId;
}
export { generateToken, generateAuthTokens, verifyToken, getUserIdByToken };