import {Request, Response} from 'express';
import {nanoid} from 'nanoid';

export const getUserID = (req: Request, res: Response): string => {
  const stringFromCokie = req.headers.cookie;
  let id = stringFromCokie
    ?.split('; ')
    .find(el => el.startsWith('idConverter'));
  if (id) {
    id = id.replace('idConverter=', '');
    //user = usersStat.find(item => item.id === id) || new User(id);
  } else {
    id = nanoid();
    res.setHeader('Set-Cookie', 'idConverter=' + id);
  }
  return id;
};
