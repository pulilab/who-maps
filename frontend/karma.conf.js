const webpack = require('webpack');
const path = require('path');

module.exports = function (config) {
  const browsers = process.env.BROWSER_ENV === 'chrome' ? ['HeadlessChrome'] : ['HeadlessCanary'];
  config.set({
    browsers: browsers,
    customLaunchers: {
      HeadlessChrome: {
        base: 'Chrome',
        flags: ['--disable-web-security', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      },
      HeadlessCanary: {
        base: 'ChromeCanary',
        flags: ['--disable-web-security', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    files: [
      'test-context.js'
    ],
    frameworks: ['jasmine'],
    logLevel: config.LOG_INFO,
    preprocessors: {
      'test-context.js': 'webpack'
    },
    colors: true,
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      fixWebpackSourcePaths: true
    },
    specReporter: {
      maxLogLines: 5,
      suppressErrorSummary: true,
      suppressFailed: false,
      suppressPassed: true,
      suppressSkipped: true,
      showSpecTiming: false,
      failFast: false
    },
    reporters: ['coverage-istanbul', 'spec'],
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'test')
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
              }
            ]
          },
          {
            test: /\.vue/,
            use: [
              { loader: 'null-loader' }
            ]
          },
          {
            test: /^(?!.*(Module|Component).*\.js$).*\.js$/,
            enforce: 'post',
            include: [
              path.resolve(__dirname, 'src')
            ],
            use: [
              { loader: 'istanbul-instrumenter-loader', options: { esModules: true } }
            ]
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2|html|scss|geojson|less)$/,
            use: [
              { loader: 'null-loader' }
            ]

          },
          {
            test: /\.(jpe?g|png|gif|ico)$/i,
            use: [
              { loader: 'file-loader', options: { hash: 'sha512', digest: 'hex', name: '[hash].[ext]' } }
            ]
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          API: '"/api/"',
          DEV: false,
          DEBUG: false,
          LIVE: false
        })
      ]
    },
    webpackServer: {
      noInfo: true
    },
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher')
    ]
  });
};
