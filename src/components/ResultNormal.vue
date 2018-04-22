<template>
  <div class="single-result">
    <div><a v-bind:href="result.link" class="title">{{ result.title }}</a></div>
    <div class="link">{{ result.link }}</div>
    <div class="summary" v-html="result.summary"></div>
    <div class="meta">Date: {{ result.date | unix2localtime }}</div>
  </div>
</template>

<script>
export default {
  name: 'ResultNormal',
  props: ["result"],
  filters: {
    unix2localtime: function(value){
      var date = new Date(parseInt(value)*1000);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }
  },
  created: function () {
    console.log("Create Single Normal Result " + this.result)
  }
}
</script>

<style scoped>

.link {
  font-size: 14px;
  color: #006621;
}

.title {
  font-size: 18px;
  color: #1a0dab;
}

.summary {
  font-size: small;
  color: #545454;
}

.meta {
  font-size: small;
  color: #1a0dab;
}

.single-result {
  margin: 15px;
}
</style>
