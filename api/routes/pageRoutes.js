import express from 'express';
import { pageController } from '../controllers/index.js';
import { authValidate, pageValidate } from '../validations/index.js';
import { validateReq, validateToken } from '../middlewares/validate.js';
import coverRoutes from './coverRoutes.js';

const router = express.Router();

router.get(
  '/getMetaAllPages',
  validateToken(authValidate.tokenSchema),
  pageController.getMetaAllPages
);

router.get(
  '/getMetaPage',
  validateToken(authValidate.tokenSchema),
  validateReq(pageValidate.getPageByIdSchema),
  pageController.getMetaPage
);

router.get(
  '/getPageById',
  validateToken(authValidate.tokenSchema),
  validateReq(pageValidate.getPageByIdSchema),
  pageController.getPageById
);

router.get(
  '/getPathPage',
  validateReq(pageValidate.getPageByIdSchema),
  pageController.getPathPage
);

router.post(
  '/',
  validateToken(authValidate.tokenSchema),
  pageController.addPage
);

router.put(
  '/',
  validateToken(authValidate.tokenSchema),
  validateReq(pageValidate.getPageByIdSchema),
  validateReq(pageValidate.updatePageSchema),
  pageController.updatePage
)

router.delete(
  '/',
  validateToken(authValidate.tokenSchema),
  validateReq(pageValidate.getPageByIdSchema),
  validateReq(pageValidate.deletePageSchema),
  pageController.deletePage
);

router.use('/cover', coverRoutes);

export default router;