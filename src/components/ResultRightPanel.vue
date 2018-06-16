<template>
  <div>
    <b-table :items="items" :fields="fields" outlined class="itemhover">
    </b-table>

    <div>Search History:</div>
    <div>
      <b-list-group class="listGrp">
        <b-list-group-item v-for="(item, index) in searchHistory" :key="index" v-on:click="historySearch(item)"
        class="itemhover" href="#">{{item}}</b-list-group-item>
      </b-list-group>
    </div>
  </div>

</template>

<script>

import ns from '../utils/NameSpace.js'

export default {
  name: 'ResultRightPanel',
  data() {
    return {
      fields: ["active_filter"],
      // items: [
      //   { active_filter: "1" },
      //   { active_filter: "2" },
      //   { active_filter: "3" }
      // ]
    }
  },
  computed: {
    items: function() {
      var arr_agg = [];
      for (var idx in this.aggregations.grade_term_agg.buckets) {
        var value = this.aggregations.grade_term_agg.buckets[idx].key + " (" + this.aggregations.grade_term_agg.buckets[idx].doc_count + ")"
        // var new_obj = {};
        // new_obj[obj.key] = obj.doc_count;
        arr_agg.push({ "active_filter":  value});
      }

      return arr_agg;
    }
  },
  props: [
    "searchHistory",
    "aggregations"
  ],    
  components: {

  },
  methods: {
    historySearch: function(text_history) {
      this.$emit("action", {action: ns.resultAction.doBasicSearch, query: {text: text_history}});
    },
  },
  created() {
    console.log("right panel created");
    // console.log(JSON.stringify(this.aggregations));
    console.log("-->>");
    console.log(this.aggregations[0]);


    for (var obj in this.aggregations.grade_term_agg.buckets) {
      console.log(this.aggregations.grade_term_agg.buckets[obj])

    }
  }
}


</script>

<style scoped>
.itemhover:hover {
  background-color: #007bff;
  color: white;
}

</style>
