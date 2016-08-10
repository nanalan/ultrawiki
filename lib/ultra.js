const fs = require('fs')
const md = require('markdown-it')({
  breaks: true,
  linkify: true,
  typographer: true
})
const mustache = require('mustache')
const titlecase = require('titlecase')

// faux 404 page
const PageNotFound = md.render(`
# Page Not Found
There's currently nothing here!
`)

let UltraWiki = module.exports = {
  name: 'UltraWiki',
  skin: 'default',
  format: (body, pagename, cb) => {
    let promise = new Promise((resolve, reject) => {
      fs.readFile(__dirname + '/../skin/' + UltraWiki.skin + '.mustache', 'utf8', (err, html) => {
        if(err) {
          if(err.code === 'ENOENT') {
            // skin not found
            reject(new Error(`Skin "${UltraWiki.skin}" not found`))
          } else reject(err)
        } else resolve(mustache.render(html, {
          wiki: UltraWiki,
          page: {
            name: titlecase(pagename)
          },
          body
        }))
      })
    })

    if(cb) promise.then(html => cb(null, html)).catch(cb)
    else return promise
  },
  page: (page, cb) => {
    let pagename = page === '' ? 'main' : page.replace(/\//g, ':').toLowerCase()

    let promise = new Promise((resolve, reject) => {
      let uri = __dirname + '/../wiki/' + pagename + '.md'
      let type = 'text/html'

      if(pagename === 'skin.css') {
        uri = __dirname + '/../skin/' + UltraWiki.skin + '.css'
        type = 'text/css'
      }

      if(pagename === 'skin.js') {
        uri = __dirname + '/../skin/' + UltraWiki.skin + '.js'
        type = 'text/javascript'
      }

      fs.readFile(uri, 'utf8', (err, body) => {
        if(err) {
          if(err.code === 'ENOENT') {
            // page not found
            UltraWiki.format(PageNotFound, pagename)
                     .then(html => resolve([ html, type ]))
                     .catch(reject)
          } else reject(err)
        } else {
          if(type === 'text/html'){
             UltraWiki.format(md.render(body), pagename)
                      .then(html => resolve([ html, type ]))
                      .catch(reject)
          } else {
            resolve([ body, type ])
          }
        }
      })
    })

    if(cb) promise.then(arg => cb(null, arg)).catch(cb)
    else return promise
  }
}
