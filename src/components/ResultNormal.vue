<template>
  <div class="hello">
    <div class="single-result">
      <b-row>
        <b-col sm="8" class="my-0">
          <div class="title">{{ result.title }}</div>
          <div class="link">{{ result.link }}</div>
          <div class="summary" v-html="result.summary"></div>
          <div class="meta">Date: {{ result.date | unix2localtime }}</div>
        </b-col>
      </b-row>
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
  },
  created: function () {
    console.log(this.result)
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

</style>
