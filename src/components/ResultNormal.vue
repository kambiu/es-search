<template>
  <div class="single-result">
    <div><a v-bind:href="result._id" class="title">{{ result._id }}</a></div>
    <div class="link">{{ result._id | build_link }}</div>
    <div class="summary" v-html="joinHighlight(result.highlight.content)"></div>
    <div class="meta">
      <span>Date: {{ result._source.date_modified }}</span>&nbsp;&nbsp;&nbsp;
      <span>Active: {{ result._source.active }}</span>&nbsp;&nbsp;&nbsp;
      <span>Active: {{ result._source.grade }}</span>&nbsp;&nbsp;&nbsp;
      <span>Age: {{ result._source.age }}</span>&nbsp;&nbsp;&nbsp;
      <span>Price: {{ result._source.price }}</span>&nbsp;&nbsp;&nbsp;
    </div>
    <!-- <div class="meta">Date: {{ result.date | unix2localtime }}</div>-->
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
    },
    build_link: function(value){
      return "http://localhost/searchapp?ref=" + value;
    }
  },
  methods: {
    joinHighlight: function(value){
      return value.join(" ");
    }
  },
  created: function () {
    // console.log("Create Single Normal Result " + this.result)
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
