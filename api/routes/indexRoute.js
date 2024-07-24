import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';

const router = express.Router();

const checkServer = catchAsync(async function (req, res, next) {
  res.status(httpStatus.OK).send({ message: "Everything will be OK" });
});

router.get(
  '',
  checkServer
);

export default router;