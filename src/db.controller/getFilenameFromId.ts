import {Request} from 'express';

export const getFilenameFromId = (req: Request) => {
  const reqParam = req.params.id.split('');
  reqParam.shift();
  return reqParam.join('');
};
