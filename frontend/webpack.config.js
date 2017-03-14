const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

// Determine if is a production build based on environment variable
const production = process.env.NODE_ENV === 'production';
const live = process.env.LIVE_FLAG === 'live';
const debug = process.env.DEBUG_MODE === 'debug';

console.log(production)

const PATH = {
    build: path.resolve(__dirname, 'builds')
};


const basePlugins = [
    new webpack.DefinePlugin({
        API: production ? '"/api/"' : '"/api/"',
        DEV: !production,
        DEBUG: debug,
        LIVE: live
    }),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
    new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Digital Health Atlas',
        inject: false
    }),
    new CleanPlugin(PATH.build)
];

const distPlugins = [
    new ExtractTextPlugin(
        {
            filename: '[name].[chunkhash].css',
            allChunks: true
        }
    ),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200 // ~50kb
    }),
    new webpack.optimize.UglifyJsPlugin(
        {
            sourceMap: false
        }
    )
].concat(basePlugins);
const devPlugins = [].concat(basePlugins);


const devPreLoaders = [
    {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [
            /node_modules/,
            /.*-spec\.js/
        ]
    }
];


module.exports = {
    entry: {
        app: ['babel-polyfill', './src/index.js'],
        vendor: [
            'angular', 'lodash',
            'eventemitter3', 'angular-material',
            'angular-messages', 'angular-password',
            'angular-aria', 'angular-ui-router',
            'd3', 'es6-promise',
            'whatwg-fetch', 'intro.js'
        ]
    },
    output: {
        path: PATH.build,
        filename: 'build.[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },
    resolve: {
        alias: {
            Common: 'src/Common/'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html/,
                loader: 'html-loader?minimize=false'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=public/fonts/[name].[ext]'
            },
            {
                test: /\.geojson/,
                loader: 'json-loader'
            },
            {
                test: /\.txt/,
                loader: 'raw-loader'
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
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost/',
                secure: false
            },
            '/media/*': {
                target:  'http://localhost/',
                secure: false
            }
        }
    },
    devtool: production ? false : 'cheap-module-eval-source-map',
    plugins: production ? distPlugins : devPlugins
};
