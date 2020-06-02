const clientConfig = require('./webpack.client.config.js')
const middleWare = require('webpack-dev-middleware')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const readFile = (fs, file) => {
	fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
}
module.exports = function devServer (app, cb) {
	// clientConfig.entry = ['webpack-hot-middleware/client', clientConfig.entry]
	const clientCompiler = webpack(clientConfig)
	console.log(clientCompiler)
	let ready
	let clientManifest
	const readyPromise = new Promise(r => {ready = r})
	const devMiddleware = middleWare(clientCompiler, {
		publicPath: clientConfig.output.publicPath,
		noInfo: true
	})
	app.use(devMiddleware)
	// TODO
	clientManifest = readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
	clientCompiler.plugin('done', stats => {
		const statsJson = stats.toJson()
		statsJson.errors.forEach(err => console.error(err))
    statsJson.warnings.forEach(err => console.warn(err))
    if (statsJson.errors.length) return
    cb(null, {
    	template: fs.readFileSync('../index.template.html', 'utf-8'),
			clientManifest
    })
	})
	return readyPromise
}