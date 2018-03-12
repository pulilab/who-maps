const webpack = require('webpack');
module.exports = function(config) {

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
            // check: {
            //     thresholds: {
            //         each: {
            //             statements: 50,
            //             branches: 40,
            //             functions: 50,
            //             lines: 50
            //         }
            //     }
            // },
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
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            'babel-loader'
                        ]
                    },
                    {
                        test: /\.vue/,
                        use: [
                            { loader: 'vue-loader' }
                        ]
                    },
                    {
                        test: /^(?!.*(Module|Component).*\.js$).*\.js$/,
                        enforce: 'post',
                        include: /src/,
                        exclude: /node_modules/,
                        use: [
                            { loader: 'istanbul-instrumenter-loader', options: { esModules: true } }
                        ]
                    },
                    {
                        test: /\.(eot|svg|ttf|woff|woff2|html|scss|geojson)$/,
                        use: [
                            { loader: 'null-loader' }
                        ]

                    },
                    {
                        test: /\.(jpe?g|png|gif|ico)$/i,
                        use: [
                            { loader: 'file-loader', options: { hash: 'sha512', digest: 'hex', name: '[hash].[ext]' } },
                            {
                                loader: 'image-webpack-loader',
                                options: { bypassOnDebug: true, optimizationLevel: 7, interlaced: false }
                            }
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
