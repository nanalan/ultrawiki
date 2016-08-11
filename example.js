const ultrawiki = require('./lib/ultra')
const express = require('express')
const app = express()

// some config
ultrawiki.name = 'My Wiki'
ultrawiki.skin = 'default'
ultrawiki.path = __dirname + '/wiki'
ultrawiki.languages = ['en']

// use the UltraWiki http middleware
app.use(ultrawiki.middleware)

// else 404s
app.all('*', (req, res) => {
  res.status(404).send('<code>UltraWiki cannot ' + req.method + ' ' + req.url + '</code>')
})

app.listen(9999)
console.log('\u001b[1mUltraWiki\u001b[22m listening on \u001b[36mhttp://localhost:9999\u001b[39m...')
