import {getUserID} from './getUserID';
import {Request, Response} from 'express';
import {storage} from '../middleware/storage';
import {ApiError} from '../service/api.error';

export const filesController = (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const files = req.files as Express.Multer.File[];
    const format = req.body.param || 'webp';
    const id = getUserID(req, res);

    if (!files || files.length === 0) {
      throw new Error('No uploaded files');
    }
    const filesNames = storage.addItem(id, files, format);
    res.status(200).json({message: filesNames});
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};
