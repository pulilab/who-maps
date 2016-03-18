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
                { type: 'html', subdir: 'html' },
                { type: 'text' }
            ]
        },
        reporters: ['progress', 'coverage'],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    },
                    {
                        test: /\.scss/,
                        loaders: ['null']
                    }
                ],
                postLoaders: [
                    {
                        test: /^((?!-spec).)*.js$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: 'istanbul-instrumenter'
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
