const { resolve } = require('path');
const HappyPack = require('happypack');
const HtmlWebpack = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Compression = require('compression-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.assign({
  devtool: isProduction ? false : 'source-map',
  mode: isProduction ? 'production' : 'development',

  entry: {
    app: './client/src/app.js',
    vendor: [
      'axios',
      'react',
      'redux',
      'history',
      'react-dom',
      'redux-saga',
      'react-redux',
      'react-router',
      'is-mergeable-object',
      'connected-react-router',
      '@material-ui/core',
      '@material-ui/icons',
    ],
  },

  optimization: {
    runtimeChunk: 'single',

    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },

  resolve: {
    extensions: ['.js', '/index.js'],
    modules: [resolve('client', 'src'), 'node_modules'],
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
      use: ['happypack/loader?id=js'],
    }],
  },

  plugins: [
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: [
        'babel-loader?retainLines&cacheDirectory',
        'eslint-loader?cache',
      ],
    }),

    new HtmlWebpack({
      path: resolve('client', 'public'),
      template: resolve('client/src/index.html'),
    }),

    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
      test: /\.txt($|\?)/i,
      uglifyOptions: { ecma: 5 },
    }),
  ].concat(!isProduction ? [] : [
    new Compression({
      asset: '[path].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]),
});
