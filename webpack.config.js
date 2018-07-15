const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

var config = module.exports = {
    entry: {
        index: path.resolve(__dirname, "app/app.js")
    }
};

config.output = {
    filename: "[name]-bundle.js",
    chunkFilename: "[id].bundle_[chunkhash].js",
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, "./dist")
};

config.devtool = "inline-sourcemap";

config.plugins = [
    new HTMLWebpackPlugin({
        filename: 'index.html',
        chunks: ['index'],
        template: "app/index.template.html",
        inject: "body"
    }),

    new webpack.DefinePlugin({
        // The various hosts and API endpoints
        // PRODUCTION_HOST: JSON.stringify(''),
        // STAGING_HOST: JSON.stringify(''),
        // PRODUCTION_API: JSON.stringify(''),
        // STAGING_API: JSON.stringify(''),
        LOCAL_API: JSON.stringify('http://localhost:8000')
    })
];

config.module = {
    rules: [
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.(jpg|png|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            exclude: /index\.template\.html$/,
            loader: 'ngtemplate-loader?relativeTo=' + (path.resolve(
                    __dirname, './app')) + '/!html-loader?root=' +
                path.resolve(__dirname, './app/assets')
        }
    ]
};