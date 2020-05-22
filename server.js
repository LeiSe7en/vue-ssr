const express = require('express')
const fs = require('fs')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

// const serverRenderer = require('vue-server-renderer').createRenderer(
//   {
//     template: fs.readFileSync('./index.template.html', 'utf-8')
//   }
// )

const serverRenderer = createBundleRenderer(serverBundle, {
  template: fs.readFileSync('./index.template.html', 'utf-8'),
  clientManifest
})
server.use('/dist', express.static('dist'))
server.get('*', function (req, res) {
  const context = {
    url: req.url
  }
  // const { app } = createApp(context)
  serverRenderer.renderToString({ title: 'Vue ssr', url: req.url }, (err, html) => {
    if (err) throw err
    res.end(html)
  })
})

server.listen(3000, function () {
  console.log('listening on port 3000')
})