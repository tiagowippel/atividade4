const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');

module.exports = {
    entry: ['./src/index.jsx'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        hot: true,
        port: 3333,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
            },
            '/graphql': {
                target: 'http://localhost:3000',
            },
        },
    },
};
