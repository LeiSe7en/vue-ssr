const { Module } = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports = (env, options) => {
  return {
    mode: env.development ? 'development' : 'production', // "production" | "development" | "none"
    entry: path.join(__dirname, '../index.js'),
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: env.development ? '[name].[hash].js' : '[name].[chunkhash].js',
      publicPath: './',
    },
    stats: {
      modules: false, // 不打印模块的详细信息，但是会保留最后的bundle的详细信息
      children: false
    },
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      contentBase: path.join(__dirname, 'dist')
    },
    target: "web",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, '../src'),
      },
      extensions: ['.js', '.vue', '.json']
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: {
        name: "manifest"
      },
      minimizer: [new UglifyJsPlugin({parallel: true}), new CssMinimizerPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            'vue-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'vue-style-loader'
            },
            env.production ? {
              loader: MiniCssExtractPlugin.loader
            } : false,
            {
              loader: 'css-loader',
              options: {
                esModule: false
              }
            }
          ].filter(Boolean)
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      env.production ? new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css'
      }) : false,
      // new CompressionPlugin(),
      env.analyze ? new BundleAnalyzerPlugin() : false,
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../index.html'),
        filename: 'index.html',
        title: "Nelson Vue SSR from Scratch"
      })
    ].filter(Boolean)
  }
   
}