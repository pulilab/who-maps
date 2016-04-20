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
                        test: /\.(eot|svg|ttf|woff|woff2|html|scss)$/,
                        loaders: ['null']
                    },
                    {
                        test: /\.(json|geojson)/,
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
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
