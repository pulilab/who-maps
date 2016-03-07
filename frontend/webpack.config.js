var webpack = require('webpack');

module.exports = {
    entry:  './src',
    output: {
        path:     'builds',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test:   /\.scss/,
                loaders: ['style', 'css', 'sass'],
            },
            {
                test:   /\.html/,
                loader: 'html',
            }
        ]
    },
    devtool: 'source-maps',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};