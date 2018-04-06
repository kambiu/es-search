<template>
  <div class="hello">
    <div class="single-result">
      <b-row><b-col sm="8"><h5 class="title">{{ result.title }}</h5></b-col></b-row>
      <b-row><b-col sm="8"><p class="link">{{ result.link }}</p></b-col></b-row>
      <b-row><b-col sm="8"><p class="summary">{{ result.summary }}</p></b-col></b-row>
      <b-row><b-col sm="8"><p class="meta">Date: {{ result.date | unix2localtime }}</p></b-col></b-row>
    </div>
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
  }
}
</script>

<style scoped>

.link {
  color: #006621;
}

.title {
  color: #1a0dab;
}

.summary {
  color: #545454;
}

.meta {
  color: #609;
}

strong {
  font-weight: bold;
  color: red;
}
</style>
