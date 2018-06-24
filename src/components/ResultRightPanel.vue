<template>
  <div>
    <!-- aggs term -->
    <div v-for="(item, index) in arr_terms_filter" :key="'term_' + index"> 
      <div>{{ item.display_name }}</div>
      <div>
        <b-list-group class="listGrp">
          <b-list-group-item v-for="(doc_count, field_value) in item.values" :key="field_value" v-on:click="filterSearchTerms(item.field_name, field_value)"
          class="itemhover" href="#">{{ field_value + " (" + doc_count + ")"}}</b-list-group-item>
        </b-list-group>
      </div>
      <br />
    </div>

    <!-- aggs term -->
    <div v-for="(item, index) in arr_ranges_filter" :key="'range_' + index"> 
      <div>{{ item.display_name }}</div>
      <div>
        <b-list-group class="listGrp">
          <b-list-group-item v-for="(field_meta, field_value) in item.values" :key="field_value" v-on:click="filterSearchRanges(item.field_name, field_meta.from, field_meta.to)"
          class="itemhover" href="#">{{ field_value + " (" + field_meta.doc_count + ")"}}</b-list-group-item>
        </b-list-group>
      </div>
      <br />
    </div>

    <b-button style="width: 100%;" v-if="resultFiltered" v-on:click="filterClear()">
      {{ labels.result.clear_filter }}
    </b-button>

    <br /><br />
    <div>{{ labels.result.history }}</div>
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
      filtered: false
    }
  },
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    arr_terms_filter: function() {
      var arr_terms = [];
      for (var key in this.aggregations) { //term_active, term_grade
        if (key.includes("terms_")) {
          var new_obj = {}
          var field_name = key.replace("terms_", "");
          new_obj["field_name"] = field_name
          //new_obj["display_name"] = ns.label.result.aggs.terms[field_name];
          new_obj["display_name"] = this.labels.custom.filter[field_name];
          new_obj["values"] = {}
          for (let term of this.aggregations[key].buckets) {
            if (parseInt(term.doc_count) > 0)
              new_obj["values"][term.key] = term.doc_count;
          }
          arr_terms.push(new_obj);
        }
        // else it is for term aggreation string type
      }
    
      return arr_terms;
    },
    arr_ranges_filter: function() {
      var arr_ranges = []
      for (var key in this.aggregations) {
        if (key.includes("ranges_")) {
          var new_obj = {}
          var field_name = key.replace("ranges_", "");
          new_obj["field_name"] = field_name
          // new_obj["display_name"] = ns.label.result.aggs.range[field_name];
          new_obj["display_name"] = this.labels.custom.filter[field_name];
          new_obj["values"] = {}
          for (let range of this.aggregations[key].buckets) {
            if (range.doc_count > 0) {
              new_obj["values"][range.key] = {};
              new_obj["values"][range.key].from = range.from;
              new_obj["values"][range.key].to = range.to;
              new_obj["values"][range.key].doc_count = range.doc_count;
            }
          }
          arr_ranges.push(new_obj);
        }
      }

      return arr_ranges;
    }
  },
  props: [
    "searchHistory",
    "aggregations",
    "resultFiltered"
  ],    
  components: {

  },
  methods: {
    historySearch: function(text_history) {
      this.$emit("action", {action: ns.resultAction.doBasicSearch, query: {text: text_history}});
    },
    filterSearchTerms: function(field_name, field_value) {
      console.log("filterSearchTerms:", field_name, field_value);
      var terms_filter = {
        term: {}
      }
      terms_filter.term[field_name] = field_value

      this.$emit("action", {action: ns.resultAction.filterSearch, filter: terms_filter});
    },
    filterSearchRanges: function(field_name, from, to) {
      console.log("filterSearchRanges: ", field_name, from, to);
      var ranges_filter = {
        range: {}
      }
      ranges_filter.range[field_name] = {};
      if (from) {
        ranges_filter.range[field_name].gte = from;
      }
      if (to) {
        ranges_filter.range[field_name].lt = to;
      }
      this.$emit("action", {action: ns.resultAction.filterSearch, filter: ranges_filter});
    },
    filterClear: function() {
      console.log("ResultRightPanel - Clear result")
      this.$emit("action", {action: ns.resultAction.clearFilter});
    }
  },
  created() {
    console.log("return >>: " + JSON.stringify(this.aggregations));
    console.log("arr_ranges_filter >>: " + JSON.stringify(this.arr_ranges_filter));
    console.log("rifhtpanel:", this.resultFiltered)
  }
}


</script>

<style scoped>
.itemhover:hover {
  background-color: #007bff;
  color: white;
}

</style>
