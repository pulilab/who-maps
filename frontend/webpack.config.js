const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// Determine if is a production build based on environment variable
const production = process.env.NODE_ENV === 'production';
const live = process.env.LIVE_FLAG === 'live';
const debug = process.env.DEBUG_MODE === 'debug';

const PATH = {
  build: path.resolve(__dirname, 'builds')
};

const plugins = [
  new webpack.DefinePlugin({
    API: production ? '"/api/"' : '"/api/"',
    DEV: !production,
    DEBUG: debug,
    LIVE: live,
    NODE_ENV: production ? '"production"' : '',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }),
  new HtmlWebpackPlugin({
    template: 'index.ejs',
    title: 'Digital Health Atlas',
    inject: false,
    chunksSortMode: 'none'
  }),
  new MiniCssExtractPlugin({
    filename: !production ? '[name].css' : '[name].[hash].css',
    chunkFilename: !production ? '[id].css' : '[id].[hash].css'
  }),
  new VueLoaderPlugin()
];

const config = {
  entry: {
    app: ['babel-polyfill', './src/index.js']
  },
  mode: 'production',
  output: {
    path: PATH.build,
    filename: 'build.[hash].js',
    chunkFilename: '[chunkhash].js'
  },
  optimization: {
    namedModules: true,
    splitChunks: {
      name: 'vendor',
      minChunks: 2
    },
    noEmitOnErrors: true,
    concatenateModules: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'dynamic-import-webpack',
                'remove-webpack'
              ]
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          !production ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less/,
        use: [
          !production ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.vue/,
        use: [
          { loader: 'vue-loader' }
        ]
      },
      {
        test: /\.html/,
        use: [
          { loader: 'html-loader', options: { minimize: false } }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          { loader: 'file-loader', options: { name: 'public/fonts/[name].[ext]' } }
        ]
      },
      {
        test: /\.geojson/,
        use: [
          { loader: 'json-loader' }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          { loader: 'file-loader', options: { hash: 'sha512', digest: 'hex', name: '[hash].[ext]' } },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 7
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      }
    ]
  },
  plugins
};

module.exports = config;
