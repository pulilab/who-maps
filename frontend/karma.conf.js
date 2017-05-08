const webpack = require('webpack');
module.exports = config =>{

    const browsers = process.env.BROWSER_ENV === 'chrome' ? ['HeadlessChrome'] : ['HeadlessCanary'];
    config.set({
        browsers,
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
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine'],
        logLevel: config.LOG_INFO,
        preprocessors: {
            'test-context.js': ['webpack', 'sourcemap']
        },
        coverageIstanbulReporter: {
            reports: ['html', 'text-summary'],
            'report-config': {

                html: {
                    subdir: 'html'
                }
            },
            fixWebpackSourcePaths: true,
            thresholds: {
                global: {
                    statements: 50,
                    branches: 40,
                    functions: 50,
                    lines: 50
                }
            }
        },
        reporters: ['progress', 'coverage-istanbul'],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /^((?!-spec).)*.js$/,
                        enforce: 'post',
                        exclude: /(node_modules|bower_components)/,
                        loader: 'istanbul-instrumenter-loader',
                        query: {
                            esModules: true
                        }
                    },
                    {
                        test: /\.(eot|svg|ttf|woff|woff2|html|scss|geojson)$/,
                        loaders: ['null-loader']
                    },
                    {
                        test: /\.(jpe?g|png|gif|ico)$/i,
                        loaders: [
                            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                        ]
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    API: '"/api/"',
                    DEV: false,
                    DEBUG: false
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
            require('karma-sourcemap-loader'),
            require('karma-chrome-launcher')
        ]
    });
};
