const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {

  // Settings for both development and production.
  exports = {
    entry: ['./app/src/draw.ts', './app/site.scss'],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true,
      open: true,
      publicPath: '/',
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [ 
            "style-loader",
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.html$/,
          use: "html-loader"
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          }],
        },
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {from: path.join(__dirname, 'app/robots.txt'), to: 'robots.txt'}
      ]),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'app/index.html'),
        filename: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.js', '.scss']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    }
  }

  // Settings for just development.
  if (argv.mode == 'development') {
    exports.plugins.push(new webpack.DefinePlugin({
      "MESSAGES_ENDPOINT": "'http://localhost:4000/messages/?quantity=100'",
      "WEBSOCKET_ENDPOINT": "'ws://localhost:4000/ws/'",
    }));
  }

  // Settings for just production.
  if (argv.mode == 'production') {
    exports.plugins.push(new webpack.DefinePlugin({
      "MESSAGES_ENDPOINT": "'https://api.pandachat.cc/messages/?quantity=100'",
      "WEBSOCKET_ENDPOINT": "'wss://api.pandachat.cc/ws/'",
    }));
  }

  return exports;
};