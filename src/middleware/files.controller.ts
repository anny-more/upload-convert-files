import {createReadStream, createWriteStream, unlink} from 'fs';
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {pipeline} from 'node:stream';
import {join, basename, extname} from 'path';
import sharp, {AvailableFormatInfo} from 'sharp';
import {getUserID} from '../middleware/getUserID';
import {Request, Response} from 'express';
import {mainQueue} from '../db.controller/queue';
import {PATH_TO_FILES} from '../consts';

export const dataStorage: GetData[] = [];

class DataStorage {
  addItem = (req: Request, res: Response) => {
    const id = getUserID(req, res);
    const info = req.body.param;
    const files = req.files as Express.Multer.File[];
    if (files) {
      while (files.length) {
        const file = files.pop();
        const item = new GetData(id, file!, info as AvailableFormatInfo);
        dataStorage.push(item);
        console.log('from files.controller str 22', dataStorage);
        mainQueue.addTask(item);
      }
    }
    if (req.file) {
      const item = new GetData(id, req.file, info as AvailableFormatInfo);
      dataStorage.push(item);
      mainQueue.addTask(item);
    }
  };
  deleteItem = async (name: string) => {
    const index = dataStorage.findIndex(item => item.filename === name);
    const filename = dataStorage[index].filename;
    await unlink(join(PATH_TO_FILES, filename), err => {
      if (err) {
        console.log(err);
      }
    });
    dataStorage.slice(index);
  };
}
export const storage = new DataStorage();

export class GetData {
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  owner: string;
  status: 'upload' | 'wait to convert' | 'ready' | 'error';
  info: sharp.AvailableFormatInfo;
  quality: number;

  constructor(
    userID: string,
    file: Express.Multer.File,
    info?: sharp.AvailableFormatInfo
  ) {
    this.info = info || sharp.format['webp'];
    this.quality = 100;
    this.originalname = file.originalname;
    this.mimetype = file.mimetype;
    this.destination = file.destination;
    this.filename =
      basename(this.originalname, extname(this.originalname)) +
      '.' +
      Date.now() +
      '.' +
      this.info;
    this.path = file.path;
    this.owner = userID;
    this.status = 'upload';
  }

  convert = async () => {
    let message;
    try {
      const pathTo = join(PATH_TO_FILES, this.filename);
      console.log('pathTo', pathTo);
      const src = createReadStream(this.path);
      const dest = createWriteStream(pathTo);
      const convert = sharp().toFormat(this.info);
      await pipeline(src, convert, dest, err => {
        if (err) {
          this.status = 'error';
          message = 'error';
        } else {
          this.status = 'ready';
          this.delete();
        }
      });
      /*
      dest.on('close', () => {
        this.status = 'ready';
        this.delete();
        message = 'complite';
      });
      */
      //res.status(200).json({message: message});
    } catch (err) {
      //res.status(400).json({message: 'Error'});
      console.log(err);
    }
  };
  delete = async () => {
    await unlink(this.path, err => {
      if (err) {
        console.log(err);
      }
    });
  };
}
