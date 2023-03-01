import {Request, Response} from 'express';
import {nanoid} from 'nanoid';

export const getUserID = (req: Request, res: Response): string => {
  const id = req.cookies.idConverter || nanoid();
  res.setHeader('Set-Cookie', `idConverter=${id}`);
  return id;
};
