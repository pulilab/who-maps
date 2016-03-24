const webpack = require('webpack');
// Determine if is a production build based on environment variable
const production = process.argv.indexOf('--dist') > -1;
const siteBuild = process.argv.indexOf('--site-build') > -1;

const distPlugins = [
    new webpack.optimize.UglifyJsPlugin(
        {
            compress: {
                warnings: false
            }
        }
    )];

const devPlugins = [];

const devPreLoaders = [
    {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    }
];


module.exports = {
    entry: './src',
    output: {
        path: production ? '../nginx/site/app/' : 'builds',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: siteBuild ? [] : devPreLoaders,

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
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
        ]
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://192.168.99.100/api/',
                secure: false
            }
        }
    },
    devtool: production || siteBuild ? false : 'eval-cheap-source-map',
    plugins: production ? distPlugins : devPlugins
};
