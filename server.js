const server = require('express')()
const fs = require('fs')
const createApp = require('./createApp')
const serverRenderer = require('vue-server-renderer').createRenderer(
  {
    template: fs.readFileSync('./index.template.html', 'utf-8')
  }
)

server.get('*', function (req, res) {
  const context = {
    url: req.url
  }
  serverRenderer.renderToString(createApp(context), { title: 'Vue ssr' }, (err, html) => {
    if (err) throw err
    res.end(html)
  })
})

server.listen(3000, function () {
  console.log('listening on port 3000')
})