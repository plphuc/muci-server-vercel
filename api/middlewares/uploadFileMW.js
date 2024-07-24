import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { promisify } from 'util';

const storage = new GridFsStorage({
  url: process.env.URIMONGODB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-${file.originalname}`,
      metadata: {
        pageId: req.query.pageId,
      }
    };
  }
});
 

const upload = multer({ storage: storage }).single('file');
const uploadFileMiddleware = promisify(upload);

export {  uploadFileMiddleware };