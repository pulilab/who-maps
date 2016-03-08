const webpack = require('webpack');
// Determine if is a production build based on environment variable
const production = process.argv.indexOf('--dist') > -1;

const distPlugins = [
    new webpack.optimize.UglifyJsPlugin(
    {
        compress: {
            warnings: false
        }
    }
)];

const devPlugins = [];

module.exports = {
    entry: './src',
    output: {
        path: 'builds',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.html/,
                loader: 'html'
            }
        ]
    },
    devtool: production ? false : 'source-maps',
    plugins: production ? distPlugins : devPlugins
};
