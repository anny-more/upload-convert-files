import {Request, Response} from 'express';
import {getUserID} from '../middleware/getUserID';
import {dataStorage} from '../middleware/files.controller';
import {getFilenameFromId} from './getFilenameFromId';

export const getStatus = (req: Request, res: Response) => {
  try {
    const owner = getUserID(req, res);
    const thisArray = dataStorage.filter(item => item.owner === owner);
    const filename = getFilenameFromId(req);
    const item = thisArray.find(item => item.filename === filename);
    res.send({message: item?.status});
  } catch (err) {
    console.log(err);
    res.status(400).json({message: 'file not found'});
  }
};
