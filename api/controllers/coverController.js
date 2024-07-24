import { coverServices, fileServices } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';
import {
  addCoverWrapper,
  removeCoverWrapper,
} from '../services/coverServices.js';
import { assignUserId } from './userController.js';
import { db } from '../db.js';
import { Types } from 'mongoose';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import Page from '../models/pageModel.js';

const getCover = catchAsync(async (req, res, next) => {
  const cover = await db.collection('photos.files').findOne({
    'metadata.pageId': req.query.pageId,
    _id: new Types.ObjectId(req.query.coverId),
  });
  if (!cover) {
    return res.status(404).send({ message: 'Cannot find the image!' });
  }

  res.set('Content-Type', cover.contentType);

  const downloadStream = await fileServices.downloadPhoto(cover._id);
  downloadStream.pipe(res);
  downloadStream.on('data', function (data) {
    return res.status(200);
  });

  downloadStream.on('error', function (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot download the image!');
  });

  downloadStream.on('end', () => {
    return res.end();
  });
});

const addCover = catchAsync(async (req, res, next) => {
  assignUserId(req);
  if (!Page.isOwner(req.query.pageId, req.userId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }
  
  const updatedCoverId = await addCoverWrapper(req, res);
  res.status(200).send({ updatedCoverId, acknowledged: true });
});

const removeCover = catchAsync(async (req, res, next) => {
  assignUserId(req);

  if (!Page.isOwner(req.query.pageId, req.userId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }
  await removeCoverWrapper(req, res);
  res.status(200).send({ acknowledged: true });
});

export { addCover, getCover, removeCover };