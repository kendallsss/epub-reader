import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { uncompress, removeDir } from 'src/lib/tools'
import { readOpfAsync } from './lib/epub'
var Promise = require('bluebird')

Promise.promisifyAll(fs)

// 传入文件，返回 md5 hash code
function hash(content) {
  let md5 = crypto.createHash('md5')
  md5.update(content)
  let d = md5.digest('hex')
  return d
}
// 尝试读取epub,建立缓存
// 注意返回值为路径 (md5 hash code)
async function loadEpubFileAsync(filepath, storepath) {
  let content = await fs.readFileAsync(filepath)
  var hashcode = hash(content)
  var distPath = path.join(storepath, hashcode)
  let rs
  try {
    await fs.statAsync(distPath)
    rs = true
  } catch (err) {
    rs = false
  }
  if (!rs) {
    console.log('缓存文件中...')
    try {
      rs = await uncompress(filepath, distPath)
    } catch (err) {
      throw new Error(`解压错误：${filepath}。${err}`)
    }
    // console.log(hashcode)
  } else {
    console.log('存在缓存。')
  }
  return hashcode
}
// var loadEpubFileAsync = Promise.promisify(loadEpubFile)
class BookManager {
  constructor(storePath) {
    this.storePath = storePath || path.join('./', '/BookLib/')
    this.indexPath = path.join(this.storePath, 'book.index')
    this.bookList = []
      // 读取书库索引
    fs.readFileAsync(this.indexPath, 'utf8').then((value) => {
      let storedIndex = JSON.parse(value)
      for (let i in storedIndex) {
        this.bookList.push(new Book(storedIndex[i]))
      }
    }).catch((err) => {
      this.bookList = []
      console.log('不存在书库索引，重新建立索引...', err)
    })
  }
  writeCatalog() {
    try {
      fs.writeFileSync(this.indexPath, JSON.stringify(this.bookList), { 'encoding': 'utf8' })
    } catch (error) {
      console.error('写入缓存失败，请检查是否有写入该目录权限')
    }
  }
  async pushBookByDir(dirPath) {
    let epublist = []
    let files = await fs.readdirSync(dirPath)
    files.forEach((filePath) => {
      let pathname = path.join(dirPath, filePath)
      let stat = fs.lstatSync(pathname)
      if (!stat.isDirectory() && pathname.endsWith('.epub')) {
        epublist.push(pathname)
      } else {
        console.log('dir?', pathname)
      }
    })
    console.log(`共有${epublist.length}'个epub书籍，开始导入...`)
    let importSuccess = 0
    let importfailed = 0
    for (let filename of epublist) {
      try {
        await this.pushBook(filename)
        importSuccess += 1
      } catch (error) {
        importfailed += 1
        console.error('导入出错。继续导入。')
      }
    }
    console.log(`成功导入${importSuccess}/${epublist.length}本书`, `${importfailed}本导入失败`)
    this.writeCatalog()
    return epublist
  }
  getLibraryCatalogue () {
    let booknamelist = []
    for (let book of this.bookList) {
      booknamelist.push(book.getMetaData('meta'))
    }

    return booknamelist
  }
  async pushBook(filePath, save = false) {
    let book = new Book(filePath, this.storePath)
    let bookID = await book.loadAsync()
    if (!bookID) return
      // console.log(bookID)
    if (this.selectBook(bookID)) {
      console.warn('这本书已经在目录中：', book.id)
    } else {
      console.log('有新书加入目录：', book.id)
      this.bookList.push(book)
    }
    if (save) this.writeCatalog()
    return this.selectBook(bookID)
  }
  selectBook(bookID) {
    for (var i in this.bookList) {
      let book = this.bookList[i]
      if (book.id === bookID) {
        return book
      }
    }
    // console.log(`查询没有：${bookID}`)
  }
  removeBook(targetID) {
    for (var i in this.bookList) {
      let book = this.bookList[i]
      if (book.id === targetID) {
        removeDir(book.localPath)
        this.bookList.splice(i, 1)
        this.writeCatalog()
        console.log('成功移除书籍：', targetID)
        return true
      }
    }
    console.warn('准备移除的书籍不存在：', targetID)
    return false
  }
}

class Book {
  constructor(filePath, storePath) {
    // 若传入json对象就使用json初始化
    if (arguments.length === 1) {
      this.initByJson(filePath)
      return
    }
    this.filePath = filePath
    this.storePath = storePath
  }
  initByJson(json) {
    this.filePath = json.filePath
    this.storePath = json.storePath
    this.opf = json.opf
    this.id = json.id
    this.localPath = json.localPath
    this.coverUrl = json.coverUrl
  }
  getCoverUrl() {
    let metadata = this.opf.metadata
    let content
    for (let node of metadata) {
      if (node.attribs && node.attribs.name === 'cover') content = node.attribs.content
    }
    if (content) {
      let manifest = this.opf.manifest
      for (let node of manifest) {
        if (node.attribs.id === content) return node.attribs.href
      }
    }
  }
  getMetaData(key) {
    if (arguments.length === 0) return this.opf.metadata
    let metadata = this.opf.metadata
    for (let node of metadata) {
      if (node.tagname === key) return (node.text)
    }
  }
  async loadAsync() {
    try {
      var bookID = await loadEpubFileAsync(this.filePath, this.storePath)
    } catch (err) {
      console.error('读取epub缓存错误。')
      throw err
    }
    let distPath = path.join(this.storePath, bookID)
    this.localPath = distPath
    this.id = bookID
    try {
      this.opf = await readOpfAsync(this.localPath)
      if (!this.opf) console.error('opf不能为空。')
    } catch (error) {
      console.error('读取opf文件出错。')
      throw error
    }
    this.coverUrl = this.getCoverUrl()
    return this.id
  }
}
export default BookManager
export { Book, BookManager }
