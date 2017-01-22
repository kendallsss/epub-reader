'use strict'
var DecompressZip = require('decompress-zip')
import fs from 'fs'
import Promise from 'bluebird'

function _uncompress(ZIP_FILE_PATH, DESTINATION_PATH, callback) {
  var unzipper = new DecompressZip(ZIP_FILE_PATH)
  let debug = false
    // Add the error event listener
  unzipper.on('error', function (err) {
      if (debug) console.log('Caught an error', err)
      callback(err)
    })
    // Notify when everything is extracted
  unzipper.on('extract', function (log) {
    if (debug) console.log('Finished extracting', log)
    callback(null, log)
  })

  // Notify 'progress' of the decompressed files
  unzipper.on('progress', function (fileIndex, fileCount) {
    if (debug) console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
  })

  // Unzip !
  unzipper.extract({
    path: DESTINATION_PATH
  })
}
var uncompress = Promise.promisify(_uncompress)
export { uncompress }
export function removeDir(fileDir) {
  let begin = new Date()
  emptyDir(fileDir)
  rmEmptyDir(fileDir)
  let es = new Date() - begin
  console.log('移除完毕，用时：', es + 'ms')
}

function emptyDir(fileUrl) {
  var files = fs.readdirSync(fileUrl)
  let count = 0
  files.forEach(function (file) {
    var stats = fs.statSync(fileUrl + '/' + file)
    if (stats.isDirectory()) {
      emptyDir(fileUrl + '/' + file)
    } else {
      fs.unlinkSync(fileUrl + '/' + file)
      count += 1
    }
  })
  console.log('成功移除', count, '个文件')
}

function rmEmptyDir(fileUrl) {
  var files = fs.readdirSync(fileUrl)
  if (files.length > 0) {
    var tempFile = 0
    files.forEach(function (fileName) {
      tempFile++
      rmEmptyDir(fileUrl + '/' + fileName)
    })
    if (tempFile === files.length) {
      fs.rmdirSync(fileUrl)
    }
  } else {
    fs.rmdirSync(fileUrl)
  }
}
