const { resolve } = require('path');
const HappyPack   = require('happypack');
const HtmlWebpack = require('html-webpack-plugin');
const Compression = require("compression-webpack-plugin");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.assign({
  devtool: isProduction ? null : 'source-map',
  mode: isProduction ? 'production' : 'development',
  
  entry: {
    'app': './client/src/app.js',
    'vendor': './client/src/vendor.js',
  },
  
  resolve: {
    unsafeCache: /node_modules/,
    extensions: ['.js', '/index.js'],
    modules: [resolve('client', 'src'), 'node_modules'],
    
    alias: {
      'sagas': './sagas',
      'actions': './actions',
    }
  },
  
  output: {
    path: resolve('client', 'dist'),
    filename: '[name]-[hash].js',
  },
  
  module: {
    rules: [{
      test: /.jsx?/,
      include: /client\/src/,
      exclude: /node_modules/,
      use: ['happypack/loader?id=js']
    }],
  },
  
  plugins: [
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: [
        'babel-loader?retainLines&cacheDirectory',
        'eslint-loader?cache',
      ]
    }),

    new HtmlWebpack({
      path: resolve('client', 'public'),
      template: resolve('client/src/index.html')
    })
  ].concat(!isProduction ? [] : [
    new Compression({
      asset: "[path].gz",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ])
});