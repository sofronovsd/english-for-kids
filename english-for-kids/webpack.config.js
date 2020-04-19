const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = () => {

    const config = {
        devtool: 'source-map',
        entry: './src/script.js',
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'script.js'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/i,
                    use: [
                        {
                            loader: 'file-loader'
                        },
                    ],
                }
            ]
        },

        plugins: [
            new CleanWebpackPlugin(),
            new FaviconsWebpackPlugin('./src/icon/favicon.ico'),
            new CopyPlugin([
                {
                    from: './src/img', to: './img'
                },
                {
                    from: './src/audio', to: './audio'
                },
                {
                    from: './src/icon', to: ''
                }
            ]),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css'
            }),
        ],

        devServer: {
            port: 8080,
            contentBase: path.join(__dirname, 'dist'),
        }

    };

    return config;
};
