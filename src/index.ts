import express from 'express';
import cookieParser from 'cookie-parser';
import {upload} from './middleware/upload';
import {download} from './controller/dowload';
import {filesController} from './controller/file.controller';
import {getStatus} from './controller/status';
import {PATH_TO_FILES, PATH_TO_FOLDER, PATH_TO_UPLOAD} from './service/consts';
import {mkdir} from 'node:fs/promises';
import {errorHandler} from './service/error.handler';

mkdir(PATH_TO_FOLDER, {recursive: true});
mkdir(PATH_TO_FILES, {recursive: true});
mkdir(PATH_TO_UPLOAD, {recursive: true});

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<a href=/upload>Upload files</a>');
});

//multer
app.post('/upload', upload, filesController);
//download files
app.get('/download/:id', download);
//get status
app.get('/status/:id', getStatus);
//error Hendler
app.use(errorHandler);

app.listen(8080, () => console.log('listening on port: 8080'));
