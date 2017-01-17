<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  /** {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }*/
</style>

<template>
  <div>
    <!--<router-view></router-view>-->
    <el-row class="tac">
      <el-col :span="8">
        <h3>回到明朝当王爷</h3>
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
          <el-submenu index="1">
            <template slot="title">导航一</template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">导航二</el-menu-item>
          <el-menu-item index="3">导航三</el-menu-item>
        </el-menu>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  import store from 'src/vuex/store'
  import BookManager from './book-manager'

  let bookPath = 'G:/react-treebeard/epub/回到明朝当王爷.epub'
  let bm = new BookManager()

  bm.removeBook('c5b1d7a57f2668f1b24e3a0df2a80020')
  bm.addBook(bookPath)
  // console.log(timeit(md5.update, content))
  // md5.update(content)
  // var d = md5.digest('hex')
  // console.log(d)

  // import MD5 from 'src/lib/md5.min.js'

  // window.f = f
  // console.log(filename, MD5(f))
  // fs.createReadStream('G:/react-treebeard/epub/回到明朝当王爷.epub').pipe(unzip.Extract({ path: '回到明朝' }))
  export default {
    store,
    methods: {
      handleOpen (key, keyPath) {
        // console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        // console.log(key, keyPath)
      }
    }
  }
</script>
