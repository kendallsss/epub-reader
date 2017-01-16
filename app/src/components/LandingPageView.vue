<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

<template>
  <div>
    <img src="./LandingPageView/assets/logo.png" alt="electron-vue">
    <h1>欢迎.{{ xmlAsStr }}</h1>
    <current-page></current-page>
    <versions></versions>
    <links></links>
  </div>
</template>

<script>
  import CurrentPage from './LandingPageView/CurrentPage'
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import Json from 'xml-json-parser'
  function test (func, obj) {
    var start = new Date().getTime()
    for (var i = 0; i < 1; i++) {
      func(obj)
    }
    var end = new Date().getTime()
    return (end - start) + 'ms'
  }
  export default {
    components: {
      CurrentPage,
      Links,
      Versions
    },
    created () {
      let x2js = new Json()
      let jsonObj = {
        MyRoot: {
          test: 'success',
          test2: {
            item: [ 'val1', 'val2' ]
          }
        }
      }

      this.xmlAsStr = x2js.json2xml_str(jsonObj)
      console.log(test(x2js.json2xml_str, jsonObj))
    },
    name: 'landing-page'
  }
</script>
