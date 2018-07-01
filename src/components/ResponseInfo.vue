<template>
  <div class="response-info">
    <!-- <div>{{hits}} results ({{time | toSecond}} seconds)</div> -->
    <div>{{ reponse_string }}</div>
  </div>
</template>

<script>
export default {
  name: 'ResponseInfo',
  // props: ["time", "hits"],
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    result_response_time() {
      return this.$store.getters.result_response_time;
    },
    result_hits() {
      return this.$store.getters.result_hits;
    },
    reponse_string() {
      return this.labels.result.hits.replace("<hits>", this.result_hits).replace("<response_time>", this.toSecond(this.result_response_time))
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
