import Page from '../models/pageModel.js';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import formattedPageObject from '../views/formattedPageObject.js';
import { Types } from 'mongoose';
import { db } from '../db.js';

const getMetaAllPages = async (userId) => {
  try {
    const pages = await Page.find(
      { "owner": userId, level: 0 }
    );
    console.log(userId);
    if (!pages.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User has no pages');
    }

    const formattedTitlePages = pages.map((page) => {
      return formattedPageObject(page);
    });
    return formattedTitlePages;
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

const getMetaPage = async ({ userId, pageId }) => {
  try {
    const page = await Page.findOne(
      { owner: userId, _id: pageId },
      { title: 1, icon: 1, level: 1, pageChildren: 1 }
    );
    if (!page) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }
    return formattedPageObject(page);
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

const getPathPage = async (pageId) => {
  try {
    const path = [];
    let id = pageId;

    while (true) {
      const page = await Page.findOne(
        { _id: id },
        { title: 1, icon: 1, level: 1, parent: 1 }
      );
      if (!page) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
      }
      path.push({ id: page._id, title: page.title, icon: page.icon });

      if (page.level === 0) {
        return path;
      }
      id = page.parent;
    }
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

const getPageById = async (pageId) => {
  try {
    const page = await Page.findOne({ _id: pageId });
    if (!page) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }
    return formattedPageObject(page);
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

const addPage = async (userId, parentPageId) => {
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();

    if (parentPageId) {
      const page = await Page.findOne({ _id: parentPageId });
      const newPageLevel = page.level + 1;

      if (newPageLevel > 2) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Maximum level is 3');
      }

      const newPage = await Page.create({
        owner: userId,
        level: newPageLevel,
        parent: parentPageId,
      });

      const updateParentPage = await updatePage(userId, parentPageId, {
        $push: { pageChildren: newPage._id },
      });

      if (!updateParentPage.acknowledged) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Update parent failed');
      }
      await session.commitTransaction();
      return newPage;
    }

    const page = await Page.create({ owner: userId, level: 0, name: 'Undefined' });
    await session.commitTransaction();
    return page;
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(err.statusCode, err.message);
  } finally {
    session?.endSession();
  }
};

const updatePage = async (userId, pageId, contentUpdate) => {
  try {
    const pageToUpdate = await Page.updateOne(
      { owner: userId, _id: new Types.ObjectId(pageId) },
      contentUpdate
    );
    return pageToUpdate;
  } catch (err) {
    throw new ApiError(err.statusCode, err.message);
  }
};

const deletePage = async (userId, pageId) => {
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();

    const pageToDelete = await Page.findOne({
      owner: userId,
      _id: pageId
    });

    if (!pageToDelete) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }

    if (pageToDelete.parent) {
      const updateParentPage = await updatePage(userId, pageToDelete.parent, {
        $pull: { pageChildren: pageId },
      });

      if (!updateParentPage.acknowledged) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Update parent failed');
      }
    }

    if (pageToDelete.pageChildren.length > 0) {
      const deleteChildrenResult = await Page.deleteMany({
        _id: { $in: pageToDelete.pageChildren },
      });

      if (!deleteChildrenResult.acknowledged) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Delete children failed');
      }
    }

    const deleteResult = await Page.deleteOne({
      owner: userId,
      _id: pageId,
    });

    if (!deleteResult.acknowledged) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Delete page failed');
    }

    await session.commitTransaction();
    return deleteResult;
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(err.statusCode, err.message);
  } finally {
    session?.endSession();
  }
};
export {
  getPageById,
  getMetaAllPages,
  getMetaPage,
  addPage,
  updatePage,
  deletePage,
  getPathPage,
};