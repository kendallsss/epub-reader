'use strict;'
var DecompressZip = require('decompress-zip')

export function uncompress (ZIP_FILE_PATH, DESTINATION_PATH, debug = false) {
  var unzipper = new DecompressZip(ZIP_FILE_PATH)

  // Add the error event listener
  unzipper.on('error', function (err) {
    if (debug) console.log('Caught an error', err)
  })

  // Notify when everything is extracted
  unzipper.on('extract', function (log) {
    if (debug) console.log('Finished extracting', log)
  })

  // Notify "progress" of the decompressed files
  unzipper.on('progress', function (fileIndex, fileCount) {
    if (debug) console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
  })

  // Unzip !
  unzipper.extract({
    path: DESTINATION_PATH
  })
}
