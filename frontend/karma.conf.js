var webpack = require('webpack');
module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine'],
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
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    },
                    {
                        test: /^((?!-spec).)*.js$/,
                        enforce: 'pre',
                        exclude: /(node_modules|bower_components)/,
                        loader: 'istanbul-instrumenter-loader',
                        query: {
                            esModules: true
                        }
                    },
                    {
                        test: /\.(eot|svg|ttf|woff|woff2|html|scss)$/,
                        loaders: ['null-loader']
                    },
                    {
                        test: /\.geojson/,
                        loader: 'json-loader'
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
            require('karma-coverage'),
            require('karma-sourcemap-loader'),
            require('karma-phantomjs-launcher')
        ]
    });
};
