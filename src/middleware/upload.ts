import {Request} from 'express';
import multer from 'multer';
import {basename, extname} from 'path';
import {PATH_TO_UPLOAD} from '../service/consts';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, PATH_TO_UPLOAD);
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      basename(file.originalname, extname(file.originalname)) +
        '.' +
        Date.now() +
        extname(file.originalname)
    );
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (acceptTypes.includes(file.mimetype)) cb(null, true);
  else cb(Error('not this'), false);
};

const MulterConfig: multer.Options = {
  storage,
  limits: {fileSize: 1048576 * 50},
};

export const upload = multer(MulterConfig).array('file', 3);
