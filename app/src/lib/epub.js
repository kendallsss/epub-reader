import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import htmlparser from 'htmlparser2'
import readline from 'readline'
Promise.promisifyAll(fs)

class RootfileParser {
  constructor(callback) {
    this.callback = callback
    this.onEntry = false
  }
  onopentag(name, attribs) {
    if (name === 'rootfile' && attribs['full-path']) {
      this.callback(null, attribs['full-path'])
    }
  }
  onclosetag(name) {
    if (name === 'rootfiles') {
      this.callback(new Error('没有找到rootfile。'))
    }
  }
}
class TagHandler {
  constructor (tagname) {
    this.tagname = tagname
    this.buffer
  }
  onopentag (name, attribs) {
    this.buffer.attribs = attribs
  }
  ontext (text) {
    this.buffer.text = text
  }
  onclosetag (tagname) {
    if (tagname === this.tagname)
    return this.buffer
  }
}
class OpfParser {
  constructor(callback) {
    if (!this.starttime) this.starttime = new Date()

    this.tags = ['metadata', 'manifest', 'spine']
    // console.log('onmeta', onmeta.onclosetag())
    this.curTag = 'metadata'
    this.metadata = []
    this.tagbuffer = {}
    this.onEntry = false
    this.callback = callback
  }
  onopentag(name, attribs) {
    if (name !== this.curTag) {
      this.finished = true
    }
    if (name === 'manifest') {
      this.finished = true
      this.callback(null, this.metadata)
      return
    }
    // 接受的第一个参数是error, 第二个参数是返回结果
    if (this.onEntry) {
      this.tagbuffer = {}
      this._name = name
      this.tagbuffer[this._name] = ''
      if (name === 'meta' && attribs.name === 'cover') {
        console.log('有封面', attribs.content)
        this.metadata.push({cover: attribs.content})
      }
    } else if (this.curTag === name) {
      this.onEntry = true
    }
  }
  ontext(text) {
    if (this._name && !this.tagbuffer[this._name]) {
      this.tagbuffer[this._name] = text.replace(/[\r\n\t ]/g, '')
    }
  }
  onclosetag(name) {
    if (name === this.curTag) {
      this.onEntry = false
      this._name = undefined
    }
    if (this.onEntry) {
      this.metadata.push(this.tagbuffer)
      console.log('close')
    }
  }
}

function _readXmlAsync(filepath, filetype, callback) {
  var tagparser = (filetype === 'metadata') ? new OpfParser(callback) : new RootfileParser(callback)
  var myParser = new htmlparser.Parser(tagparser, {
    decodeEntities: true,
    xmlMode: true
  })
  var readStream = fs.createReadStream(filepath)
  readStream.on('data', (chunk) => {
    // console.log(`用时 ${new Date() - starttime} ms`)
    myParser.write(chunk)
  })
  readStream.on('error', (error) => {
    console.error('读取文件错误', filepath)
    callback(error)
  })
  readStream.on('end', function () {
    // 当没有数据时，关闭数据流
    myParser.end()
    readStream.close()
  })
}
var readXmlAsync = Promise.promisify(_readXmlAsync)

async function readOpfAsync(filepath, encoding = 'utf8') {
  var fullpath = path.join(filepath, 'META-INF/container.xml')
  try {
    var rootfilePath = await readXmlAsync(fullpath, 'rootfile')
    var metadata = await readXmlAsync(path.join(filepath, rootfilePath), 'metadata')
  } catch (error) {
    return
  }
  return metadata
}
export { readOpfAsync }
