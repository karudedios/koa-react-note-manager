import Koa from 'koa';
import * as models from './models';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';
const mongodbUrl = process.env.DB || 'mongodb://0.0.0.0:27017/krnm';

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true
});


const app = new Koa();

app.use(context => {
  context.models = models;
});

app.listen(port, ip, () => {
  // eslint-disable-next-line
  console.log(`Server listening on ${ip}:${port}`);
});
