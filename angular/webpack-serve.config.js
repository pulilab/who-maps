const webpackConfig = require('./webpack.config');
const proxy = require('http-proxy-middleware');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');

webpackConfig.mode = 'development';
webpackConfig.serve = {
  host: '0.0.0.0',
  add: (app, middleware, options) => {
    app.use(convert(proxy('/api', { target: 'http://localhost', secure: false })));
    app.use(convert(proxy('/media', { target: 'http://localhost', secure: false })));
    app.use(convert(proxy('/static', { target: 'http://localhost', secure: false })));
    app.use(convert(proxy('/translation', { target: 'http://localhost', secure: false })));
    app.use(convert(history()));
  }
};

module.exports = webpackConfig;
