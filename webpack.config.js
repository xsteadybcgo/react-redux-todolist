const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require("webpack");

const config = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: "main.js",      
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"],
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({template:__dirname+'/src/index.html'}),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimize: false,
    splitChunks: {
        chunks: 'all'
    }
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  mode: "development"
};
module.exports = config;
