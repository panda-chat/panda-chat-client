const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app/src/draw.ts',
  devServer: {
    contentBase: path.join(__dirname, 'app')
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
            "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.scss' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/dist'),
    publicPath: ''
  }
};