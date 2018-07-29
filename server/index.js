import { join } from 'path';
import buildApi from './api';
import Express from 'express';
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

const app = Express()
  .use(fileUpload())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use('/api', buildApi(Services, Models))
  .get('/attachments/:name', (req, res, next) => {
    res.status(200).sendFile(req.params.name, {
      root: join(__dirname, '..', 'attachments')
    }, function(err) {
      if (err) return next(err);
    });
  });

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../client/webpack.config.js');

  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'client/src',
    stats: {
      hash: false,
      colors: true,
      chunks: true,
      timings: true,
      modules: false,
      chunkModules: true,
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(Express.static(join(__dirname, 'client', 'dist', 'index.html')));
} else {
  app.use(Express.static(__dirname + '/client/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(join(__dirname, '/client/dist/index.html'));
  });
}

app
  .listen(port, ip, () => {
    // eslint-disable-next-line
    console.log(`Server listening on ${ip}:${port}`);
  });
