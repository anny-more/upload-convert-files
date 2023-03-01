import {Request, Response} from 'express';
import {getUserID} from './getUserID';
import {storage} from '../middleware/storage';
import {ApiError} from '../service/api.error';

export const download = (req: Request, res: Response, next: Function) => {
  try {
    const filename = req.params.id;
    const owner = getUserID(req, res);
    if (storage.noItem(owner, filename)) {
      throw Error('no file');
    }
    if (storage.showItemStatus(owner, filename) === 'error') {
      throw Error('this file not suppoted');
    }
    if (storage.showItemStatus(owner, filename) !== 'ready') {
      throw Error('file not ready yet');
    }
    const src = storage.getItemStream(owner, filename);
    src.pipe(res);
    res.on('close', () => storage.deleteItem(filename));
    //res.status(200).json({message: 'ok'});
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};
