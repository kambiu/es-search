<template>
  <div class="response-info">
    <div>{{hits}} results ({{time | toSecond}} seconds)</div>
  </div>
</template>

<script>
export default {
  name: 'ResponseInfo',
  props: ["time", "hits"],
  filters: {
    toSecond: function(value){
      return parseInt(value) / 1000.0;
    }
  }
  
}
</script>

<style scoped>

</style>
