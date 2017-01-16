<style scoped>
  code {
    background-color: rgba(40, 56, 76, .5);
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
    padding: 3px 6px;
    margin: 0 3px;
    vertical-align: bottom;
  }

  p { line-height: 24px; }
</style>

<template>
  <p>
    你当前 <code>`{{ xml }}`</code> on the <code>`{{ $route.name }}`</code> view.
  </p>
</template>

<script>
  // var parser = require('xml2json')
  export default {
    created () {
      if (process.env.NODE_ENV === 'testing') {
        this.$route = {
          name: 'landing-page',
          path: '/landing-page'
        }
      }
    }
  }
</script>
