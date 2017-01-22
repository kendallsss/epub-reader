var Promise = require('bluebird')
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/styles.css'
import BookManager from './book-manager.js'
import {readOpfAsync} from './lib/epub.js'
// import readXmlFile from './lib/epub.js' import BookManager from
// './book-manager' import DOMParser from 'xmldom' import co from 'co' import
// Promise from 'bluebird' let bookPath = 'H:/豆瓣高分电子书合集/豆瓣高分电子书合集/回到明朝当王爷.epub'
// let bm = new BookManager() //
// bm.removeBook('c5b1d7a57f2668dsdf3a0df2a80020') bm.saveBook(bookPath)
// console.log(readOpfAsync)
let bm = new BookManager() // bm.removeBook('c5b1d7a57f2668dsdf3a0df2a80020')
function test(e) {
  let file = 'H:/豆瓣高分电子书合集/豆瓣高分电子书合集/《百家讲坛》七周年限量珍藏版/15刘心武谈红楼-1293608899606.epub'
  let file2 = 'L:/《希灵帝国》远瞳(著).epub'
  try {
    bm
      .pushBook(file2)
      .then((book) => {
        console.log('OPF->>：', book.opf)
        console.log(book.getCoverUrl())
        // console.log(book.getMetaData('cover'))
      })
  } catch (err) {
    console.log(err)
  }
  // bm
  //   .pushBookByDir('H:/豆瓣高分电子书合集/豆瓣高分电子书合集/阿加莎.克里斯蒂侦探全集')
  //   .then((data) => {
  //     console.log('导入完毕。', data)
  //     let start = new Date()
  //     let menu = bm.getLibraryCatalogue()
  //     console.log(new Date() - start + 'ms')
  //     console.log(menu)
  //   })
}

// var xmlcontent
// fs.readFile('G:/GitHub/epub-reader/BookLib/1ea8ecf25b17d978560f3db4060f0fb8/co
// ntent.opf', 'utf8', (err, data) => {   xmlcontent = data   //
// console.log(data)   if (err) throw err   var tagparser = new
// MetaParser((data) => {     console.log(data)   })   var myParser = new
// htmlparser.Parser(tagparser, { decodeEntities: true,     xmlMode: true})
// myParser.write(xmlcontent)   myParser.end() })

ReactDOM.render(
  <section id="container">
  <ul id="stage">
    <li data-tags="Print Design"><img
      onClick={(e) => test(e)}
      src={require('./assets/img/shots/2.jpg')}
      alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/2.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design"><img src={require('./assets/img/shots/3.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Print Design"><img src={require('./assets/img/shots/4.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design"><img src={require('./assets/img/shots/5.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design,Print Design"><img src={require('./assets/img/shots/6.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/7.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design"><img src={require('./assets/img/shots/8.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design"><img src={require('./assets/img/shots/9.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design"><img src={require('./assets/img/shots/10.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/11.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/12.jpg')} alt="Illustration"/></li>
    <li data-tags="Print Design"><img src={require('./assets/img/shots/13.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design"><img src={require('./assets/img/shots/14.jpg')} alt="Illustration"/></li>
    <li data-tags="Print Design"><img src={require('./assets/img/shots/15.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design"><img src={require('./assets/img/shots/16.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design,Print Design"><img src={require('./assets/img/shots/17.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design"><img src={require('./assets/img/shots/18.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Print Design"><img src={require('./assets/img/shots/19.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/20.jpg')} alt="Illustration"/></li>
    <li data-tags="Web Design,Logo Design"><img src={require('./assets/img/shots/21.jpg')} alt="Illustration"/></li>
    <li data-tags="Print Design"><img src={require('./assets/img/shots/22.jpg')} alt="Illustration"/></li>
    <li data-tags="Logo Design,Print Design"><img src={require('./assets/img/shots/23.jpg')} alt="Illustration"/></li>
  </ul>
</section>, document.getElementById('app'))
