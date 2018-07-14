<template>
  <div id="app">    
    <SearchApp />

  </div>
</template>

<script>

import SearchApp from './components/SearchApp.vue'
import test from './components/test.vue'
export default {
  name: 'app',
  components: {
    SearchApp,
    test
  }
}
</script>

<style>
</style>
