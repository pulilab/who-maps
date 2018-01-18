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
    new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Digital Health Atlas',
        inject: false
    }),
    new ExtractTextPlugin({
        filename: '[name].[chunkhash].css',
        allChunks: true,
        disable: !production
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity })
];

const distPlugins = basePlugins.concat([
    new CleanPlugin(PATH.build),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        chunks: ['app'],
        filename: 'common.js',
        minChunks: 2
    }),
    new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 50000 // Minimum number of characters
    }),
    new UglifyJsPlugin({
        sourceMap: false
    })
]);


const config  = {
    entry: {
        app: ['babel-polyfill', './src/index.js'],
        vendor: [
            'angular',
            'eventemitter3', 'angular-material',
            'angular-messages', 'angular-password',
            'angular-aria', 'angular-ui-router',
            'd3', 'es6-promise', 'trix', 'vue',
            'ng-file-upload', 'moment', 'angular-gettext',
            'redux'
        ]
    },
    output: {
        path: PATH.build,
        filename: 'build.[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|unit-test)/,
                use: [
                    {
                        loader: 'babel-loader', options: {
                            plugins: [
                                'dynamic-import-webpack',
                                'remove-webpack'
                            ]
                        }
                    },
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
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader'],
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
            },
            '/translation/*': {
                target:  'http://localhost/',
                secure: false
            }
        }
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: basePlugins
};

if (production) {
    config.entry.common = ['./src/Common/', './src/store/', './src/plugins/'];
    config.devtool = false;
    config.plugins = distPlugins;
    config.module.rules[0].use[0].options.plugins = [];
}

module.exports = config;
