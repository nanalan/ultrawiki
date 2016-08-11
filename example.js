'use strict'

const ultrawiki = require('./lib/ultra')
const express = require('express')
const app = express()

// some config
ultrawiki.name = 'My Awesome Wiki'
ultrawiki.skin = 'default'
ultrawiki.path = __dirname + '/wiki'
ultrawiki.mainPage = 'welcome'
ultrawiki.languages = ['en', 'fr']
ultrawiki.navigation = [
  ['Section', [
    ['Some Other Page', 'some-other-page']
  ]]
]

// use the UltraWiki http middleware
app.use(ultrawiki.middleware)

app.listen(9999)
console.log('\u001b[1mUltraWiki\u001b[22m listening on \u001b[36mhttp://localhost:9999\u001b[39m...')
