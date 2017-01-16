var DecompressZip = require('decompress-zip')
let ZIP_FILE_PATH = 'G:/react-treebeard/epub/回到明朝当王爷.epub'
let DESTINATION_PATH = '回到明朝当王爷'
function uncompress (ZIP_FILE_PATH, DESTINATION_PATH) {
  var unzipper = new DecompressZip(ZIP_FILE_PATH)

  // Add the error event listener
  unzipper.on('error', function (err) {
    console.log('Caught an error', err)
  })

  // Notify when everything is extracted
  unzipper.on('extract', function (log) {
    console.log('Finished extracting', log)
  })

  // Notify "progress" of the decompressed files
  unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
  })

  // Unzip !
  unzipper.extract({
    path: DESTINATION_PATH
  })
}
uncompress(ZIP_FILE_PATH, DESTINATION_PATH)
