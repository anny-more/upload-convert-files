import {Request, Response} from 'express';
import {getUserID} from './getUserID';
import {storage} from '../middleware/storage';
import {ApiError} from '../service/api.error';

export const getStatus = (req: Request, res: Response, next: Function) =>
{
  try {
    const id = getUserID(req, res);
    const name = req.params.id;
    const status = storage.showItemStatus(id, name);
    res.send({message: status});
  } catch (err) {
    next(ApiError.badRequest(`${err}`));
  }
};
