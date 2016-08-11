# UltraWiki
> A lightweight [MediaWiki](https://github.com/wikimedia/mediawiki) alternative written in Node.js.

## Installation
**The easy way** using `bash` (Linux / Mac):
```sh
$ cd my-awesome-wiki
$ if [[ ! -f package.json ]]; then echo '{ "private":true }' >> package.json; fi; npm install --save ultrawiki express && mkdir wiki && curl -fsSL https://github.com/nanalan/ultrawiki/raw/master/example.js >> wiki.js && perl -pi -e "s/\'\.\/lib\/ultra\'/\'ultrawiki\'/g" wiki.js && mkdir wiki/en && echo '# Welcome to [My Wiki](/)!' >> wiki/en/welcome.md && node wiki.js
# visit http://localhost:9999 in a web browser
```

**The hard way** using `manual labor` (Windows):  
- Open up a folder (say, `my-awesome-wiki`) in `Files`, `Finder`, or `My Documents`
- Make a `package.json` file
- In `Command Prompt` or `Terminal`, navigate to that folder and run `npm install --save ultrawiki`
- Copy [this file](https://raw.githubusercontent.com/nanalan/ultrawiki/master/example.js) into `wiki.js`
- Make a folder, `wiki`, and put another folder, `en`, inside it
- Inside `wiki/en`, create `welcome.md` and put "Hello"
- Replace "./lib/ultra" in `wiki.js` with "ultrawiki" (near the top)
- Run `node wiki.js`
- Visit [this page](http:/localhost:9999) and **profit**!
