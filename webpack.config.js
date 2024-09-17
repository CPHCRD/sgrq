/*
 * Plugins
 */
var path = require('path');
var webpack = require('webpack');
// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HandlebarsPlugin = require("handlebars-webpack-plugin");

/*
 * Helpers
 */
var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);

/*
 * Config
 */
module.exports = {
  // for faster builds use 'eval'
  devtool: 'source-map',
  debug: true,
  entry: {
    'vendor': './src/vendor.js', // our vendors
    'main': './src/index.js' // our application
  },

  // Config for our build files
  output: {
    path: './build/assets',
    publicPath: './assets/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    loaders: [
      // Javascript loader
      { 
        test: /\.js$/, 
        exclude: /node_modules|backup/, 
        loader: 'babel-loader'
      },
      // Support for SCSS as sass
      {
        test: /\.scss$/,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      },
      // support for .html as raw text
      { 
        test: /\.html$/,
        loader: 'raw-loader' 
      },
      // support for fonts
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader : 'file-loader'
      },
      // json loader
      { 
        test: /\.json$/,
        loader: 'json'
      }
    ],
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common', filename: 'common.js', minChunks: 2, chunks: ['main', 'vendor'] }),
    new HandlebarsPlugin({
      entry: "./src/index.hbs",
      output: "./build/index.html",
      data: require("./src/index.json"),
      partials: [
          "./src/partials/**/*.hbs"
      ]
    }),
    new webpack.ProvidePlugin({
      '$': "jquery",
      'jQuery': "jquery",
      'Promise': 'imports?this=>global!exports?global.Promise!es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new BrowserSyncPlugin({
      open: false,
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['build'] }
    })
  ]

};