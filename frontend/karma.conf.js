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
                global: {
                    statements: 50,
                    branches: 30,
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
                        test: /\.(json|geojson)/,
                        loader: 'json'
                    },
                    {
                        test: /\.(jpe?g|png|gif|ico)$/i,
                        loaders: [
                            'file?hash=sha512&digest=hex&name=[hash].[ext]',
                            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                        ]
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
                    API: '"/api/"',
                    DEV: false
                })
            ]
        },
        webpackServer: {
            noInfo: true
        }
    });
};
