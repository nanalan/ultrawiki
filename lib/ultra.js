const fs = require('fs')
const path = require('path')
const mime = require('mime')
const languages = require('languages')

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
  links: [
    ['Welcome', '/']
  ],
  languages: ['en'],

  // http middleware
  middleware: (req, res, next) => {
    const url = req.url.substr(1).split('/')

    if(req.url === '/' || !url[1]) {
      // redirect
      let to = (req.socket.encrypted ? 'https://' : 'http://') + req.headers.host + '/' + (url[0] || ultrawiki.languages[0]) + '/' + ultrawiki.mainPage
      res.writeHead(302, {
        Location: to
      })
      res.end()
      return
    }

    switch(url[0]) {
      case 'skin':
        const resource = url[1].split('.')
        const type = resource.pop()
        const skin = ultrawiki.getSkin(resource.join('.'))

        if(skin[type]) {
          skin[type]().catch(err => {
            next(err)
          }).then(file => {
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
              if(err.code === 'ENOENT') {
                // TODO - ask if one wants to create said page
              }

              next(err)
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
    let where

    if(skin === 'default') where = path.join(__dirname, '../', 'skin')
    else {
      let pckg = 'ultrawiki-skin-' + skin

      try {
        where = require(pckg)
      } catch(e) {
        throw 'Couldn\'t load skin "' + skin + '". Try:\n $ npm install ' + pckg
      }
    }

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

  render: (raw, pagename, what, language, body) => {
    let wiki = {}

    Object.assign(wiki, ultrawiki, {
      languages: ultrawiki.languages.map(code => [ languages.getLanguageInfo(code).nativeName, code]),
      hasOtherLanguages: ultrawiki.languages.length > 1
    })

    return mustache.render(raw, {
      wiki,
      page: {
        name: titlecase(pagename.replace(/(-|_)/g, ' ')),
        what,
        language,
        body
      },
    })
  },

  format: (body, pagename, what, language, cb) => {
    let promise = new Promise((resolve, reject) => {
      ultrawiki.getSkin(ultrawiki.skin).mustache((err, raw) => {
        if(err) {
          reject(err)
        } else {
          try {
            resolve(ultrawiki.render(raw, pagename, what, language, body))
          } catch(err) {
            reject(err)
          }
        }
      })
    })

    if(cb) promise.then(html => cb(null, html)).catch(cb)
    else return promise
  },

  page: (page, lang, cb) => {
    let pagename = page === '' ? ultrawiki.mainPage : page.replace(/\//g, ':').toLowerCase()

    let promise = new Promise((resolve, reject) => {
      let uri = __dirname + '/../wiki/' + lang + '/' + pagename + '.md'

      fs.readFile(uri, 'utf8', (err, body) => {
        if(err) {
          reject(err)
        } else {
          if(err) reject(err)
          else {
            body = ultrawiki.render(body, pagename, page || ultrawiki.mainPage, lang)

            ultrawiki.format(md.render(body), pagename, page || ultrawiki.mainPage, lang)
                     .then(html => resolve(html))
                     .catch(reject)
          }
        }
      })
    })

    if(cb) promise.then(arg => cb(null, arg)).catch(cb)
    else return promise
  }
}
