import ApiError from '../utils/ApiError.js';
import { fileServices, pageServices } from './index.js';
import httpStatus from 'http-status';
import { uploadFileMiddleware } from '../middlewares/uploadFileMW.js';
import { db } from '../db.js';
import Page from '../models/pageModel.js';
import { Types } from 'mongoose';

const getCover = async (req, res, userId) => {
  const coverId = req.params.id;
};

const addCoverWrapper = async (req, res) => {
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();

    // must place before check already exists cover to get pageId in body
    //  upload new cover
    await uploadFileMiddleware(req, res);
    const { id: newCoverId } = req.file;

    //  check if page already has cover. Yes -> remove
    const { cover } = await pageServices.getPageById(req.query.pageId);
    if (cover) {
      const deletedCover = await fileServices.deletePhoto(cover);

      if (deletedCover.deletedCount <= 1) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cover not found');
      }
    }

    const updatedPage = await pageServices.updatePage(
      req.userId,
      req.query.pageId,
      {
        cover: newCoverId,
      }
    );

    if (updatedPage.acknowledged === false) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Update cover failed');
    }

    await session.commitTransaction();
    return newCoverId;
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(err.statusCode, err.message);
  } finally {
    session?.endSession();
  }
};

const removeCoverWrapper = async (req, res) => {
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();

    const updatedPage = await Page.updateOne(
      {
        owner: new Types.ObjectId(req.userId),
        _id: new Types.ObjectId(req.query.pageId),
      },
      { $unset: { cover: '' } }
    );

    if (updatedPage.modifiedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }
    const deletedCover = await fileServices.deletePhoto(req.query.coverId);

    if (deletedCover.deletedCount <= 1) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cover not found');
    }

    if (updatedPage.acknowledged === false) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Remove cover failed');
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(err.statusCode, err.message);
  } finally {
    session?.endSession();
  }
};

export { addCoverWrapper, removeCoverWrapper };