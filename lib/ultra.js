const fs = require('fs')
const path = require('path')
const mime = require('mime')

const md = require('markdown-it')({
  breaks: true,
  linkify: true,
  typographer: true
})
const mustache = require('mustache')
const titlecase = require('titlecase')

let ultrawiki = module.exports = {
  // config
  name: 'UltraWiki',
  skin: 'default',
  path: __dirname + '/wiki',
  languages: ['en'],

  // http middleware
  middleware: (req, res, next) => {
    const url = req.url === '/' ? [ultrawiki.languages[0], 'main'] : req.url.substr(1).split('/')

    console.log(req.method, url.join('/'))

    switch(url[0]) {
      case 'skin':
        const type = url[1].split('.').pop()
        const skin = ultrawiki.getSkin(ultrawiki.skin)

        if(skin[type]) {
          skin[type]().catch(next).then(file => {
            res.writeHead(200, { 'Content-Type': mime.lookup(url.pop()) })
            res.write(file)
            res.end()
          })
        } else {
          // not found
          next()
        }
      break

      default:
        if(ultrawiki.languages.indexOf(url[0]) === -1) {
          // not found
          next()
        } else {
          ultrawiki.page(url[1], url[0], (err, page) => {
            if(err) {
              // not found
              // TODO - ask if they want to create that page
              next()
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' })
              res.write(page)
              res.end()
            }
          })
        }
      break
    }
  },

  // // //

  getSkin: skin => {
    // TODO - read from package.json (like Brunch)

    let where = path.join(ultrawiki.path, '../', 'skin')

    const getter = ftype => {
      return cb => {
        let promise = new Promise((resolve, reject) => {
          fs.readFile(path.join(where, skin + '.' + ftype), 'utf8', (err, file) => {
            if(err) reject(err)
            else resolve(file)
          })
        })

        if(cb) promise.then(arg => cb(null, arg)).catch(cb)
        else return promise
      }
    }

    return {
      css: getter('css'),
      js: getter('js'),
      mustache: getter('mustache')
    }
  },

  format: (body, pagename, cb) => {
    let promise = new Promise((resolve, reject) => {
      ultrawiki.getSkin(ultrawiki.skin).mustache((err, html) => {
        if(err) {
          reject(err)
        } else resolve(mustache.render(html, {
          wiki: ultrawiki,
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

  page: (page, lang, cb) => {
    let pagename = page === '' ? 'main' : page.replace(/\//g, ':').toLowerCase()

    let promise = new Promise((resolve, reject) => {
      let uri = __dirname + '/../wiki/' + lang + '/' + pagename + '.md'

      fs.readFile(uri, 'utf8', (err, body) => {
        if(err) {
          reject(err)
        } else {
           ultrawiki.format(md.render(body), pagename)
                    .then(html => resolve(html))
                    .catch(reject)
        }
      })
    })

    if(cb) promise.then(arg => cb(null, arg)).catch(cb)
    else return promise
  }
}
