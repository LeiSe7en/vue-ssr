const express = require('express')
const fs = require('fs')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const { createRenderer } = require('vue-server-renderer')
const createApp = require('./dist/main').default
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const devServer = require('./build/dev-server')
// const serverRenderer = createRenderer({template: fs.readFileSync('./index.template.html', 'utf-8')})

const serverRenderer = createBundleRenderer(serverBundle, {
  template: fs.readFileSync('./index.template.html', 'utf-8'),
  clientManifest
})

const _createRenderer = function (bundle, options) {
  return createBundleRenderer(serverBundle, options)
}
const render = function (req, res) {
  renderer.renderToString({ title: 'Vue ssr', url: req.url }, (err, html) => {
    if (err) throw err
    res.end(html)
  })
}
let renderer
server.use('/dist', express.static('dist'))
const clientPromise = devServer(server, _createRenderer)
server.get('*', function (req, res) {
  const context = {
    url: req.url
  }
  // createApp(context).then(app => {
  //   serverRenderer.renderToString(app, { title: 'Vue ssr', url: req.url }, (err, html) => {
  //     if (err) throw err
  //     res.end(html)
  //   })
  // })
  clientPromise.then(res => {
    render(req, res)
  })
})

server.listen(3001, function () {
  console.log('listening on port 3001')
})