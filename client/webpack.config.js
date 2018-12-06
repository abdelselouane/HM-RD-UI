const path = require('path');
const webpack = require('webpack');
require('babel-polyfill');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  const config = {
    entry: {
      vendor: ['styled-components'],
      index: ['babel-polyfill', './src/index.jsx']
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.join(__dirname, 'public'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loaders: ['babel-loader']
        },
        {
          test: /\.(css|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=fonts/'
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: ['file-loader?name=[name].[ext]']
        },
        {
          test: /newRelicBrowser\.js$/,
          use: ['file-loader?name=[name].[ext]']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            minSize: 0
          }
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFileName: '[id].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new webpack.DefinePlugin({
        E2E_TEST: process.env.NODE_ENV === 'test',
        PROD: options.mode === 'production'
      })
    ]
  };

  if (options && options.mode === 'development') {
    config.devServer = {
      host: 'localhost.homedepot.com',
      port: 3001,
      open: true,
      proxy: {
        '/': 'http://localhost.homedepot.com:3000'
      }
    };
  }

  return config;
};
