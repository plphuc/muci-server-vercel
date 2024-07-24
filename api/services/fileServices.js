import { db } from '../db.js';
import { GridFSBucket } from 'mongodb';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

const getPhoto = async (fileId) => {};

const downloadPhoto = async (photoId) => {
  try {
    const bucket = new GridFSBucket(db, {
      bucketName: 'photos',
    });

    let downloadStream = bucket.openDownloadStream(photoId);
    return downloadStream
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deletePhoto = async (fileId) => {
  try {
    const deletedFile = await db
      .collection('photos.files')
      .deleteOne({ _id: new Types.ObjectId(fileId) });

    const deletedChunks = await db.collection('photos.chunks').deleteMany({
      files_id: new Types.ObjectId(fileId),
    });

    return {
      deletedCount: deletedFile.deletedCount + deletedChunks.deletedCount,
    };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

export { deletePhoto, downloadPhoto };