import express, {Request, Response} from 'express';
import {upload} from './middleware/upload';
import {download} from './db.controller/dowload';
import {storage} from './middleware/files.controller';
import {getStatus} from './db.controller/status';
import {mkdir} from 'node:fs/promises';
import {PATH_TO_FILES, PATH_TO_UPLOAD} from './consts';
import {join} from 'node:path';

const app = express();

mkdir(join(process.cwd(), 'storage'), {recursive: true});
mkdir(PATH_TO_FILES, {recursive: true});
mkdir(PATH_TO_UPLOAD, {recursive: true});

app.get('/', (req, res) => {
  res.send('<a href=/upload>Upload files</a>');
});

//multer
app.post('/upload', upload, (req, res) => {
  storage.addItem(req, res);
  res.json({message: 'OK'});
});

//download files
app.get('/download/:id', download);
//get status
app.get('/status/:id', getStatus);

app.use(express.json());

app.listen(8080, () => console.log('listening on port: 8080'));
