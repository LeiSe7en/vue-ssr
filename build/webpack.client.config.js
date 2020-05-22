const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')
const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  // 这里的entry如果不传对象，只传一个字符串作为path，那么会使用main作为chunk的名字
  // 如果使用对象，则对象的key作为chunk的名字

	entry: './client-entry',
	plugins: [
		// 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
	]
})
