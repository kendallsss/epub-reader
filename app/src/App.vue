<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
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
  }
</style>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import store from 'src/vuex/store'
  import MD5 from 'src/lib/md5.min.js'
  import fs from 'fs'
  let filename = 'G:/react-treebeard/epub/回到明朝当王爷.epub'
  let f = fs.readFileSync(filename, 'utf8')
  console.log(filename, MD5(f))
  // fs.createReadStream('G:/react-treebeard/epub/回到明朝当王爷.epub').pipe(unzip.Extract({ path: '回到明朝' }))
  export default {
    store
  }
</script>
