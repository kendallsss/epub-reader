import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import htmlparser from 'htmlparser2'
import readline from 'readline'
Promise.promisifyAll(fs)

class RootfileParser {
  constructor(callback) {
    this.callback = callback
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
// class TagHandler {
//   constructor (tagname) {
//     this.tagname = tagname
//     this.buffer
//   }
//   onopentag (name, attribs) {
//     this.buffer.attribs = attribs
//   }
//   ontext (text) {
//     this.buffer.text = text
//   }
//   onclosetag (tagname) {
//     if (tagname === this.tagname)
//     return this.buffer
//   }
// }
class OpfParser {
  constructor(callback) {
    if (!this.starttime) this.starttime = new Date()
    this.data = {}
    this.blockNameList = ['guide', 'spine', 'manifest', 'metadata']
    this.curBlock = this.blockNameList.pop()
    this.blocks = []
    this.tagbuffer = {}
    this.onBlock = false
    this.callback = callback
  }
  onopentag(name, attribs) {
    if (this.curBlock === name) {
      this.onBlock = true
      return
    }
    if (name !== this.curBlock && this.blockNameList[this.blockNameList.length - 1] === name) {
      this.curBlock = this.blockNameList.pop()
      this.onBlock = true
      return
    }
    // 接受的第一个参数是error, 第二个参数是返回结果
    if (this.onBlock) {
      this.tagname = name
      this.tagbuffer = {}
      this.tagbuffer.tagname = this.tagname
      if (Object.getOwnPropertyNames(attribs).length > 0) this.tagbuffer.attribs = attribs
    }
  }
  ontext(text) {
    if (this.tagname && !this.tagbuffer[this.tagname]) {
      let rs = text.replace(/[\r\n\t ]/g, '')
      if (rs !== '') {
        this.tagbuffer.text = rs
      }
    }
  }
  onclosetag(name) {
    // 遇到Tag结束 保存Tag到Blocks
    // 遇到当前Block结束 保存Block到最终结果
    if (name === this.curBlock) {
      this.onBlock = false
      this.data[this.curBlock] = this.blocks
      this.blocks = []
    // 遇到最后一个闭合标签，返回buffer
      if (this.blockNameList.length === 0) {
        this.callback(null, this.data)
      }
    }
    if (this.onBlock) {
      if (this.tagbuffer) this.blocks.push(this.tagbuffer)
      this.tagname = undefined
    }
    this.tagbuffer = {}
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
