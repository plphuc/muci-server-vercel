import mongoose from 'mongoose';
import validator from 'validator';

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled',
    required: true,
  },
  icon: {
    type: String,
  },
  cover: { type: mongoose.SchemaTypes.ObjectId, ref: 'Photo' },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  pageChildren: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Page' }],
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Page' },
  version: {
    type: String,
  },
  blocks: [
    {
      type: Object,
    },
  ],
  time: {
    type: Date,
    default: Date.now,
  },
  isFavPage: { type: Boolean, default: false },
  fontName: {type: String, default: "'Raleway', monospace"},

  sharedUser: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 2
  }
});

pageSchema.statics.isOwner = async function (pageId, userId) {
  const page = await this.findOne({ _id: pageId });
  return page?.owner.toString() === userId.toString();
};

const Page = mongoose.model('Page', pageSchema);
export default Page;