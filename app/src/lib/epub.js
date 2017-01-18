import fs from 'fs'
import xpath from 'xpath'
export function getOpf (filePath) {
  let Dom = require('xmldom').DOMParser
  let f = fs.readFileSync(filePath, 'utf8')
  // console.log('node: ' + f)
  let befor = new Date()
  let doc = new Dom().parseFromString(f)
  let dcselect = xpath.useNamespaces({'dc': 'http://purl.org/dc/elements/1.1/', 'opf': 'http://www.idpf.org/2007/opf'})
  let opf = {
    'title': dcselect('//opf:package/opf:metadata/dc:title/text()', doc)[0].nodeValue,
    'author': dcselect('//opf:package/opf:metadata/dc:creator/text()', doc)[0].nodeValue,
    'modification': dcselect('//opf:package/opf:metadata/dc:date[@opf:event=\'modification\']/text()', doc)[0].nodeValue,
    'cover': dcselect('//opf:package/opf:metadata/opf:meta[@name=\'cover\']/@content', doc)[0].nodeValue,
    'lang': dcselect('//opf:package/opf:metadata/dc:language/text()', doc)[0].nodeValue,
    'publisher': dcselect('//opf:package/opf:metadata/dc:publisher/text()', doc)[0].nodeValue
  }
  console.log(new Date() - befor + 'ms')
  return opf
}
