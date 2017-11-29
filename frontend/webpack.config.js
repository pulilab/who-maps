const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Determine if is a production build based on environment variable
const production = process.env.NODE_ENV === 'production';
const live = process.env.LIVE_FLAG === 'live';
const debug = process.env.DEBUG_MODE === 'debug';


const PATH = {
    build: path.resolve(__dirname, 'builds')
};


const basePlugins = [
    new webpack.DefinePlugin({
        API: production ? '"/api/"' : '"/api/"',
        DEV: !production,
        DEBUG: debug,
        LIVE: live,
        NODE_ENV: production ? '"production"' : ''
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
    new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        allChunks: true,
        disable: true
    }),
    new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Digital Health Atlas',
        inject: false
    })
];

const distPlugins = basePlugins.concat([
    new CleanPlugin(PATH.build),
    new UglifyJsPlugin({
        sourceMap: false
    })
]);

const devPlugins = basePlugins.concat([]);


module.exports = {
    entry: {
        app: ['babel-polyfill', './src/index.js'],
        vendor: [
            'angular',
            'eventemitter3', 'angular-material',
            'angular-messages', 'angular-password',
            'angular-aria', 'angular-ui-router',
            'd3', 'es6-promise', 'trix', 'moment'
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
                exclude: /(node_modules|bower_components|unit-test)/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.vue/,
                use: [
                    { loader: 'vue-loader' }
                ]
            },
            {
                test: /\.html/,
                use: [
                    { loader: 'html-loader', options: { minimize: false } }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    { loader: 'file-loader', options: { name: 'public/fonts/[name].[ext]' } }
                ]
            },
            {
                test: /\.geojson/,
                use: [
                    { loader: 'json-loader' }
                ]
            },
            {
                test: /\.txt/,
                use: [
                    { loader: 'raw-loader' }
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
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost/',
                secure: false
            },
            '/media/*': {
                target:  'http://localhost/',
                secure: false
            },
            '/static/*': {
                target:  'http://localhost/',
                secure: false
            }
        }
    },
    devtool: production ? false : 'cheap-module-eval-source-map',
    plugins: production ? distPlugins : devPlugins
};
