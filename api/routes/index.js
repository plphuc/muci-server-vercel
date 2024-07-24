import authRouter from './authRoutes.js';
import pageRouter from './pageRoutes.js';
import userRouter from './userRoutes.js';
import checkRoute from './indexRoute.js';

import express from 'express';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/page',
    route: pageRouter,
  }, 
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/',
    route: checkRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;