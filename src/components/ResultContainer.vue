<template>
  <div class="hello">
    <p>----------------------</p>
    <ResultNormal v-bind:result="singleresult"></ResultNormal>
  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'

export default {
  name: 'ResultContainer',
  data() {
    return {
      singleresult: {
        title: "Android One Moto X4",
        link: "https://www.android.com/phones/moto-x4/",
        date: "1522989114",
        summary: "Tap into the best of <strong>Android</strong> on the Android One Moto X4, pairing premier hardware with a best-in-class Google experience",
        
      }
    }
  },
  components: {
    ResultNormal
  },
}


</script>

<style scoped>

</style>
