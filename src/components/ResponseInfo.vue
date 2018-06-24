<template>
  <div class="response-info">
    <!-- <div>{{hits}} results ({{time | toSecond}} seconds)</div> -->
    <div>{{ reponse_string }}</div>
  </div>
</template>

<script>
export default {
  name: 'ResponseInfo',
  props: ["time", "hits"],
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    reponse_string() {
      return this.labels.result.hits.replace("<hits>", this.hits).replace("<reponse_time>", this.toSecond(this.time))
    }
  },
  methods: {
    toSecond: function(value){
      return parseInt(value) / 1000.0;
    }
  },
  filters: {
    toSecond: function(value){
      return parseInt(value) / 1000.0;
    }
  }
  
}
</script>

<style scoped>

</style>
