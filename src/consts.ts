import {join} from 'path';

const PATH_TO_FILES = join(process.cwd(), 'storage', 'files-storage');
const PATH_TO_UPLOAD = join(process.cwd(), 'storage', 'multer-storage');

export {PATH_TO_FILES, PATH_TO_UPLOAD};
