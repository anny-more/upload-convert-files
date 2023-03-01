import {unlink} from 'node:fs/promises';
import {createReadStream, createWriteStream} from 'node:fs';
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {join, basename, extname} from 'node:path';
import sharp from 'sharp';
import {PATH_TO_FILES} from '../service/consts';

export class GetData {
  originalname: string;
  filename: string;
  path: string;
  owner: string;
  status: 'upload' | 'wait to convert' | 'ready' | 'error';
  info: 'jpeg' | 'png' | 'webp' | 'gif' | 'svg';
  quality: number;

  constructor(
    userID: string,
    file: Express.Multer.File,
    info?: 'jpeg' | 'png' | 'webp' | 'gif' | 'svg'
  ) {
    this.info = info || 'webp';
    this.quality = 100;
    this.originalname = file.originalname;
    this.filename = `${basename(file.filename, extname(file.filename))}.${
      this.info
    }`;
    this.path = file.path;
    this.owner = userID;
    this.status = 'upload';
  }

  convert = async () => {
    const pathTo = join(PATH_TO_FILES, this.filename);
    try {
      const src = createReadStream(this.path);
      const dest = createWriteStream(pathTo);
      const convert = sharp().toFormat(this.info);
      src.pipe(convert).pipe(dest);
      convert.on('error', async () => {
        this.status = 'error';
        await unlink(pathTo);
      });
      convert.on('finish', () => {
        this.status = 'ready';
        this.delete();
      });
    } catch (err) {
      this.status = 'error';
      await unlink(pathTo);
    }
  };
  delete = async () => {
    await unlink(this.path);
  };
}

export const dataStorage: GetData[] = [];
