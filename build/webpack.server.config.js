const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
	entry: './server-entry.js',
	devtool: 'source-map',
	target: 'node',
	output: {
		libraryTarget: 'commonjs2'
	},
	externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.css$/
  }),
	plugins: [
		// 这个是Vue的自定义webpack组件，这个组件生成一个.json文件，这个文件是配合createBundleRenderer
		// 使用的
    new VueSSRServerPlugin()
  ]
})