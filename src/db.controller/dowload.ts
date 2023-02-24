import {Request, Response} from 'express';
import {join} from 'path';
import {getUserID} from '../middleware/getUserID';
import {dataStorage, storage} from '../middleware/files.controller';
import {getFilenameFromId} from './getFilenameFromId';
import {PATH_TO_FILES} from '../consts';

export const download = (req: Request, res: Response) => {
  try {
    const owner = getUserID(req, res);
    const thisArray = dataStorage.filter(item => item.owner === owner);
    const filename = getFilenameFromId(req);
    const item = thisArray.find(item => item.filename === filename);
    if (item?.status !== 'ready') {
      res.status(400).json({message: 'file not ready yet'});
      return;
    }
    const pathTo = join(PATH_TO_FILES, filename);
    res.download(pathTo, err => {
      if (err) {
        res.send({error: err, msg: 'Problem downloading the file'});
      } else {
        storage.deleteItem(filename);
      }
    });
  } catch {
    console.log('problem to downlod');
  }
};
