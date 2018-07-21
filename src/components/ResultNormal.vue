<template>
  <div class="single-result">
    <el-card class="box-card" shadow="hover">
      <div><a v-bind:href="result._id" class="title">{{ result._id }}</a></div>
      <div class="link">{{ result._id | build_link }}</div>
      <div class="summary" v-html="joinHighlight(result.highlight.content)"></div>
      <div class="meta">
        <span>{{labels.custom.display_fields.date}} {{ result._source.date_modified }}</span>&nbsp;&nbsp;&nbsp;
        <span>{{labels.custom.display_fields.active}} {{ result._source.active }}</span>&nbsp;&nbsp;&nbsp;
        <span>{{labels.custom.display_fields.grade}} {{ result._source.grade }}</span>&nbsp;&nbsp;&nbsp;
        <span>{{labels.custom.display_fields.age}} {{ result._source.age }}</span>&nbsp;&nbsp;&nbsp;
        <span>{{labels.custom.display_fields.price}} {{ result._source.price }}</span>&nbsp;&nbsp;&nbsp;
      </div>
    </el-card>
    <!-- <div class="meta">Date: {{ result.date | unix2localtime }}</div>-->
  </div>
</template>

<script>
export default {
  name: 'ResultNormal',
  props: ["result"],
  computed: {
    labels() {
      return this.$store.state.labels;
    },
  },
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

.title {
  font-size: 18px;
  color: #1a0dab;
  margin-bottom: 10px;
}

.link {
  font-size: 14px;
  color: #006621;
  margin-bottom: 5px;
}


.summary {
  font-size: small;
  color: #545454;
  margin-bottom: 5px;
}

.meta {
  font-size: small;
  color: #1a0dab;
}

.single-result {
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 50px;

}
</style>
