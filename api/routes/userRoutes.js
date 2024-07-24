import express from 'express';
import { userController } from '../controllers/index.js';
import { validateToken } from '../middlewares/validate.js';
import { authValidate } from '../validations/index.js';

const router = express.Router();

router.get(
  '/getUser',
  validateToken(authValidate.tokenSchema),
  userController.getUser
);

export default router;