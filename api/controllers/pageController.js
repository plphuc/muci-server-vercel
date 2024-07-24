import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { pageServices, tokenServices } from '../services/index.js';
import ApiError from '../utils/ApiError.js';
import Page from '../models/pageModel.js';

const getMetaAllPages = catchAsync(async (req, res) => {
  const userId = tokenServices.getUserIdByToken(req);
  const metaPages = await pageServices.getMetaAllPages(userId);

  res.status(httpStatus.OK).send({ pages: metaPages });
});

const getMetaPage = catchAsync(async (req, res) => {
  const userId = tokenServices.getUserIdByToken(req);
  const metaPage = await pageServices.getMetaPage({
    userId,
    pageId: req.query.pageId,
  });

  res.status(httpStatus.OK).send({ page: metaPage });
});

const getPageById = catchAsync(async (req, res) => {
  const page = await pageServices.getPageById(req.query.pageId);
  if (!page) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  }
  res.status(httpStatus.OK).send({ page });
});

const getPathPage = catchAsync(async (req, res) => {
  const path = await pageServices.getPathPage(req.query.pageId);
  res.status(httpStatus.OK).send({ path });
});

const addPage = catchAsync(async (req, res) => {
  const userId = tokenServices.getUserIdByToken(req);
  const parentId = req.query.parentId;

  const { _id: id } = await pageServices.addPage(userId, parentId);
  res.status(httpStatus.CREATED).send({ id, acknowledged: true });
});

const updatePage = catchAsync(async (req, res) => {
  const userId = tokenServices.getUserIdByToken(req);

  if (!Page.isOwner(req.query.pageId, userId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }

  const updateResult = await pageServices.updatePage(userId, req.query.pageId, {
    $set: { ...req.body },
  });
  if (!updateResult.acknowledged) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Update failed');
  }
  res.status(httpStatus.OK).send({ acknowledged: true });
});

const deletePage = catchAsync(async (req, res) => {
  const userId = tokenServices.getUserIdByToken(req);

  if (!Page.isOwner(req.query.pageId, userId)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }
  await pageServices.deletePage(userId, req.query.pageId);
  res.status(httpStatus.OK).send({ acknowledged: true });
});

export {
  addPage,
  updatePage,
  deletePage,
  getPageById,
  getMetaAllPages,
  getMetaPage,
  getPathPage
};