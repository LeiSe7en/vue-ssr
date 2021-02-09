const { Module } = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: "development", // "production" | "development" | "none"
  entry: path.join(__dirname, '../index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "index.bundle.js",
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  target: "web",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../index.html'),
      filename: 'index.html',
      title: "Nelson Vue SSR from Scratch"
    })
  ]
}