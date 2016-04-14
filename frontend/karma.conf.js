const webpack = require('webpack');
module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine', 'phantomjs-shim'],
        preprocessors: {
            'test-context.js': ['webpack', 'sourcemap']
        },
        coverageReporter: {
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ],
            check: {
                each: {
                    statements: 50,
                    branches: 50,
                    functions: 50,
                    lines: 50
                }
            }
        },
        reporters: ['progress', 'coverage'],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.(eot|svg|ttf|woff|woff2|html|scss)$/,
                        loaders: ['null']
                    },
                    {
                        test: /\.json/,
                        loader: 'json'
                    }
                ],
                preLoaders: [
                    {
                        test: /-spec\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel'
                    },
                    {
                        test: /^((?!-spec).)*.js$/,
                        exclude: /(node_modules|bower_components)/,
                        loaders: ['babel-istanbul']
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    API: '"/api/"'
                })
            ]
        },
        webpackServer: {
            noInfo: true
        }
    });
};
