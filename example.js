const ultrawiki = require('./lib/ultra')
const http = require('http')

http.createServer((req, res) => {
  let page = req.url.substr(1) // ignore the leading slash

  // let UltraWiki do the rest
  // (you can use node-style callbacks or Promises)
  ultrawiki.page(page).then(([ body, type ]) => {
    res.writeHead(200, { 'Content-Type': type })
    res.write(body)
    res.end()
  }).catch(err => console.error(err))
}).listen(9999)
