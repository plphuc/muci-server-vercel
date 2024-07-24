import mongoose from 'mongoose';
import config from './config/config.js';

mongoose.connect(config.uriMongoDB).then(() => {
  console.log('Connected to database');
});

export const db = await mongoose.createConnection(config.uriMongoDB).asPromise();