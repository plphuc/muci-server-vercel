import mongoose from 'mongoose';
import tokenTypes from '../config/token.js';

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      index: true,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
    },
    expire: {
      type: Date,
      required: true,
    },
  },
  { timestamp: true }
);

const Token = mongoose.model('Token', tokenSchema)
export default Token