'use strict;'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import {uncompress, removeDir} from 'src/lib/tools'
// 传入文件，返回 md5 hash code
function hash (content) {
  let md5 = crypto.createHash('md5')
  md5.update(content)
  let d = md5.digest('hex')
  return d
}
// 尝试载入epub,建立缓存
// 注意返回值为路径 (md5 hash code)
export function cacheEpub (filePath, storePath) {
  let content
  try {
    content = fs.readFileSync(filePath)
  } catch (error) {
    console.warn(`载入的书籍不存在：${filePath}`)
    return
  }

  let hashcode = hash(content)
  let distPath = path.join(storePath, hashcode)
  fs.exists(distPath, (exists) => {
    if (!exists) {
      console.log('建立缓存文件中...')
      uncompress(filePath, distPath)
    }
  })
  return hashcode
}
export default class BookManager {
  constructor (storePath) {
    this.storePath = path.join('./', '/BookLib/')
    this.indexPath = path.join(this.storePath, 'book.index')
    this.bookList = []
    // 读取书库索引
    try {
      let f = fs.readFileSync(this.indexPath, 'utf8')
      this.bookList = JSON.parse(f)
    } catch (error) {
      this.bookList = []
      console.log('不存在书库索引，重新建立索引...')
    }
  }
  saveIndex () {
    try {
      fs.writeFileSync(this.indexPath, JSON.stringify(this.bookList), {'encoding': 'utf8'})
    } catch (error) {
      console.error('写入缓存失败，请检查是否有写入该目录权限')
    }
  }
  addBook (filePath) {
    let book = new Book(filePath, this.storePath)
    if (this.exist(book.id)) {
      console.warn('这本书已经在目录中：', book.id)
      this.saveIndex()
      return
    }
    this.bookList.push(book)
    this.saveIndex()
  }
  exist (targetID) {
    for (var i in this.bookList) {
      if (this.bookList[i].id === targetID) {
        return true
      }
    }
    return false
  }
  removeBook (targetID) {
    for (var i in this.bookList) {
      let book = this.bookList[i]
      if (book.id === targetID) {
        removeDir(book.localPath)
        this.bookList.splice(i, 1)
        this.saveIndex()
        console.log('成功移除书籍：', targetID)
        return true
      }
    }
    console.warn('准备移除的书籍不存在：', targetID)
    return false
  }
}

import {getOpf} from './lib/epub'
export class Book {
  constructor (filePath, storePath) {
    let bookID = cacheEpub(filePath, storePath)
    let distPath = storePath + bookID
    this.localPath = distPath
    this.id = bookID
    this.loadOpf()
    this.title = this.opf.title
  }
  loadOpf () {
    if (!this.opf) {
      this.opf = getOpf(path.join(this.localPath, 'OEBPS/content.opf'))
    }
  }
}
