import Express from 'express';
import buildApi from './api';
import mongoose from 'mongoose';
import * as Models from './models';
import bodyParser from 'body-parser';
import * as Services from './services';
import fileUpload from 'express-fileupload';

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';
const mongodbUrl = process.env.DB || 'mongodb://0.0.0.0:27017/krnm';

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true
});


Express()
  .use(fileUpload())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use('/api', buildApi(Services, Models))
  .listen(port, ip, () => {
    // eslint-disable-next-line
    console.log(`Server listening on ${ip}:${port}`);
  });
