const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

// Determine if is a production build based on environment variable
const production = process.argv.indexOf('--dist') > -1;
const siteBuild = process.argv.indexOf('--site-build') > -1;

const PATH = {
    build: 'builds'
};


const basePlugins = [
    new webpack.DefinePlugin({
        API: production ? '"/api/"' : '"/api/"',
        DEV: !production
    }),
    new webpack.optimize.CommonsChunkPlugin(
        'vendor', 'vendor.js', Infinity
    ),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Digital Health Atlas',
        inject: false
    }),
    new CleanPlugin(PATH.build)
];

const distPlugins = [
    new ExtractTextPlugin('[name].[chunkhash].css', {
        allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
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
        exclude: /node_modules/
    }
];


module.exports = {
    entry: {
        app: './src/index.js',
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
        preLoaders: siteBuild ? [] : devPreLoaders,

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                // loaders: ['style', 'css', 'sass']
                loader: production ? ExtractTextPlugin.extract('style', 'css!sass') : 'style!css!sass'
            },
            {
                test: /\.html/,
                loader: 'html?minimize=false'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            },
            {
                test: /\.json|geojson/,
                loader: 'json'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ],
        sassLoader: {
            outputStyle: 'compressed'
        }
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://192.168.99.100/',
                secure: false
            }
        }
    },
    devtool: production || siteBuild ? false : 'eval-cheap-source-map',
    plugins: production ? distPlugins : devPlugins
};
