import {join} from 'path';
const PATH_TO_FOLDER = join(process.cwd(), 'storage');
const PATH_TO_FILES = join(PATH_TO_FOLDER, 'files-storage');
const PATH_TO_UPLOAD = join(PATH_TO_FOLDER, 'multer-storage');

export {PATH_TO_FOLDER, PATH_TO_FILES, PATH_TO_UPLOAD};
