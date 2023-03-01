import {NextFunction, Request, Response} from 'express';
import {ApiError} from './api.error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    next();
    res.status(err.code).json({message: err.message});
    return;
  }
  res.status(400).json({message: 'Smth went wrong'});
  next();
};
