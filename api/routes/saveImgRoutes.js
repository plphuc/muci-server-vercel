import express from 'express';
import multer from 'multer';
import path from 'path';
import { createUrl, create } from '../views/imgResponse.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // save image here
    cb(null, './public/uploadImages');
  },
  filename: function (req, file, cb) {
    // how file is named
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed!'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/uploadByFile', upload.single('file'), create);
router.post('/uploadByUrl', createUrl);

export default router;