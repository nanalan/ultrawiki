# UltraWiki
> A lightweight [MediaWiki](https://github.com/wikimedia/mediawiki) alternative written in Node.js.

## Installation
**The easy way** using `bash` (Linux / Mac):
```sh
$ cd my-awesome-wiki
$ if [[ ! -f package.json ]]; then echo "{}" >> package.json; fi; npm install --save ultrawiki && mkdir wiki && curl -fsSL https://github.com/nanalan/ultrawiki/raw/master/example.js >> wiki.js && mkdir wiki && mkdir wiki/en && echo "# Welcome to [{{wiki.name}}](/)!" >> wiki/en/welcome.md && node wiki.js
# visit http://localhost:9999 in a web browser
```

**The hard way** using `manual labor` (Windows):
1. Open up a folder (say, `my-awesome-wiki`) in `Files`, `Finder`, or `My Documents`
2. Make a `package.json` file
3. In `Command Prompt` or `Terminal`, navigate to that folder and run `npm install --save ultrawiki`
4. Copy [this file](https://raw.githubusercontent.com/nanalan/ultrawiki/master/example.js) into `wiki.js`
5. Make a folder, `wiki`, and put another folder, `en`, inside it
6. Inside `wiki/en`, create `welcome.md` and put "Hello"
7. Run `node wiki.js`
8. Visit [this page](http:/localhost:9999) and **profit**!
