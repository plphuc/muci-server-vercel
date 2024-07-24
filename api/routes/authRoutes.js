import express from 'express';
import { authController } from '../controllers/index.js';
import { validateReq, validateToken } from '../middlewares/validate.js';
import { authValidate } from '../validations/index.js';

const router = express.Router();
 
router.post('/register', validateReq(authValidate.registerSchema), authController.register);
router.post('/login', validateReq(authValidate.loginSchema), authController.login);

// Receive refresh token, validate and generate new access token
router.get('/generateAccessToken', validateToken(authValidate.tokenSchema), authController.generateAccessToken);

export default router;