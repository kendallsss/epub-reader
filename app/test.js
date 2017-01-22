var htmlparser = require('htmlparser2')
var Promise = require('bluebird')

var fs = require('fs')



var start = new Date()

function ltrim(input, chars) {
  let index = 0
  if (!input || !chars) throw new Error('字符串或需要删除的字符不能为空')
  for (let i in input) {
    for (let j in chars) {
      if (input[i] === chars[j]) {
        index = i
      } else {
        break
      }
    }
  }
  return input.slice(index, input.length)
}


class MetaParser {
  constructor(func) {
    this.tagname = 'metadata'
    this.metadata = []
    this.tagbuffer = {}
    this.enter = false
    this.func = func
  }
  onopentag(name, attribs) {
    if (this.enter) {
      this.tagbuffer = {}
      this._name = name
      this.tagbuffer[this._name] = ''
    }
    if (!this.enter && this.tagname === name) {
      this.enter = true
    }
  }
  ontext(text) {
    if (this._name && !this.tagbuffer[this._name]) {
      this.tagbuffer[this._name] = text.replace(/[\r\n\t ]/g, '')
      this.metadata.push(this.tagbuffer)
    }
  }
  onclosetag(name) {
    if (name === this.tagname) {
      this.func(this.metadata)
    }
  }
}

async function readOpf(filepath) {
  var xmlcontent
  fs.readFile('G:/GitHub/epub-reader/BookLib/1ea8ecf25b17d978560f3db4060f0fb8/content.opf', 'utf8', (err, data) => {
    xmlcontent = data
      // console.log(data)
    if (err) throw err
    var tagparser = new MetaParser((data) => {
      console.log(data)
    })
    var myParser = new htmlparser.Parser(tagparser, {
      decodeEntities: true,
      xmlMode: true
    })
    myParser.write(xmlcontent)
    myParser.end()
  })
}

var xmlcontent
fs.readFile('G:/GitHub/epub-reader/BookLib/1ea8ecf25b17d978560f3db4060f0fb8/content.opf', 'utf8', (err, data) => {
  xmlcontent = data
    // console.log(data)
  if (err) throw err
  var tagparser = new MetaParser((data) => {
    console.log(data)
  })

  var myParser = new htmlparser.Parser(tagparser, {
    decodeEntities: true,
    xmlMode: true
  })
  myParser.write(xmlcontent)
  myParser.end()
})


// var containerParser = new htmlparser.Parser({
//   onopentag: function (name, attribs) {
//     if (name === 'script' && attribs.type === 'text/javascript') {
//       console.log('JS! Hooray!')
//     }
//   },
//   ontext: function (text) {
//     console.log('-->', text)
//   },
//   onclosetag: function (tagname) {
//     if (tagname === 'script') {
//       console.log('That\'s it?!')
//     }
//   }
// }, { decodeEntities: true,
//   xmlMode: true})
// containerParser.write('Xyz <script type="text/javascript">var foo = "<<bar>>"</ script>"')
// containerParser.end()
console.log(new Date() - start + 'ms')





























// var fs = require('fs')
// var Promise = require('bluebird')
// var parser = require('xml2json')
// var path = require('path')

// Promise.promisifyAll(fs)

// function readXmlFile(filePath, encoding = 'utf8') {
//   return new Promise((resolve, reject) => {
//     fs.readFileAsync(filePath, encoding).then((value) => {
//       let opf
//       try {
//         opf = parser.toJson(value, {object: true})
//       } catch (err) {
//         reject(new Error('xml解析出错'))
//       }
//       resolve(opf)
//     }).catch((error) => {
//       reject(error)
//     })
//   })
// }

// function getOpfPath(filePath) {
//   return new Promise((resolve, reject) => {
//   let fullPath = path.join(filePath, 'META-INF/container.xml')
//   console.log(fullPath)
//   readXmlFile(fullPath)
//     .then((value) => {
//       resolve(path.join(filePath, value.container.rootfiles.rootfile['full-path']))
//     }).catch((error) => {
//       reject(error)
//     })
//   })
// }



//       // let doc = new Dom().parseFromString(value)
//       // let dcselect = xpath.useNamespaces({'dc': 'http://purl.org/dc/elements/1.1/', 'opf': 'http://www.idpf.org/2007/opf'})
//       // let opf = {
//       //   'title': dcselect('//opf:package/opf:metadata/dc:title/text()', doc)[0].nodeValue,
//       //   'author': dcselect('//opf:package/opf:metadata/dc:creator/text()', doc)[0].nodeValue,
//       //   'modification': dcselect('//opf:package/opf:metadata/dc:date[@opf:event=/'modification/']/text()', doc)[0].nodeValue,
//       //   'cover': dcselect('//opf:package/opf:metadata/opf:meta[@name=/'cover/']/@content', doc)[0].nodeValue,
//       //   'lang': dcselect('//opf:package/opf:metadata/dc:language/text()', doc)[0].nodeValue
//       //   // 'publisher': dcselect('//opf:package/opf:metadata/dc:publisher/text()', doc)[0].nodeValue
//       // }
// function readOpf (filePath) {
//   return new Promise((resolve, reject) => {
//     getOpfPath(filePath).then((value) => {
//       resolve(value)
//     })
//   })
// }
// readOpf('G:/GitHub/epub-reader/BookLib/afc62efbab2c9dc3b6d82b06daed3265/').then((value) => {
//   console.log(value)
// })
