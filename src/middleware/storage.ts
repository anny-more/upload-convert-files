import {unlink} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {join} from 'node:path';
import {AvailableFormatInfo} from 'sharp';
import {mainQueue} from './queue';
import {PATH_TO_FILES} from '../service/consts';
import {dataStorage, GetData} from './getdata';

class DataStorage {
  addItem = (
    id: string,
    files: Express.Multer.File[],
    format: AvailableFormatInfo
  ) => {
    const filesNames = [];
    while (files.length) {
      const file = files.pop();
      if (!file) {
        throw new Error('No files upload');
      }
      const item = new GetData(id, file, format as AvailableFormatInfo);
      filesNames.push(item.filename);
      dataStorage.push(item);
      mainQueue.addTask(item);
    }
    return filesNames;
  };
  deleteItem = async (name: string) => {
    console.log(dataStorage);
    const index = dataStorage.findIndex(item => item.filename === name);
    const filename = dataStorage[index].filename;
    console.log('!!', filename, index);
    await unlink(join(PATH_TO_FILES, filename));
    dataStorage.splice(index, 1);
    console.log(dataStorage);
  };
  showItemStatus = (id: string, name: string) => {
    const owner = id;
    const files = dataStorage.filter(item => item.owner === owner);
    const item = files.find(item => item.filename === name);
    return item ? item.status : 'Status not found';
  };
  getItemStream = (id: string, name: string) => {
    const owner = id;
    const files = dataStorage.filter(item => item.owner === owner);
    const item = files.find(item => item.filename === name);
    if (!item) {
      throw new Error('file not found');
    }
    return createReadStream(join(PATH_TO_FILES, item.filename));
  };
  noItem = (id: string, name: string) => {
    const owner = id;
    const files = dataStorage.filter(item => item.owner === owner);
    const item = files.find(item => item.filename === name);
    return !item ? true : false;
  };
}

export const storage = new DataStorage();
export {GetData};
