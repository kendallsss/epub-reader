'use strict;'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import {uncompress} from 'src/lib/tools'
// 传入文件，返回 md5 hash code
function hash (content) {
  let md5 = crypto.createHash('md5')
  md5.update(content)
  let d = md5.digest('hex')
  return d
}
// 尝试载入epub,建立缓存
// 注意返回值为路径 (md5 hash code)
export function loadEpub (filePath, storePath) {
  fs.exists(filePath, (exists) => {
    if (!exists) {
      throw new Error(`文件不存在：${filePath}`)
    }
  })
  let content = fs.readFileSync(filePath)
  let hashcode = hash(content)
  let distPath = path.join(storePath, hashcode)
  fs.exists(distPath, (exists) => {
    if (!exists) {
      console.log('解压中...')
      uncompress(filePath, distPath)
    } else {
      console.log('已有缓存')
    }
  })
  return hashcode
}
export default class BookManager {
  constructor (storePath) {
    this.storePath = path.join(__dirname, '/BookLib/')
    this.bookList = []
  }
  addBook (filePath) {
    let book = new Book(filePath, this.storePath)
    for (var i in this.bookList) {
      if (this.bookList[i].id === book.id) return
    }
    this.bookList.push(book)
  }
}

export class Book {
  constructor (filePath, storePath) {
    console.log(`载入新书籍，路径：${filePath}`)
    let bookID = loadEpub(filePath, storePath)
    let distPath = storePath + bookID
    console.log(`载入完毕，缓存路径： '${distPath}`)
    this.distPath = distPath
    this.id = bookID
  }
}
