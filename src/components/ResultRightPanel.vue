<template>
  <div>
    <!-- debug button  
    <el-button @click="debug">DebugRightPanel</el-button> -->
    
    <!-- filter tree -->
    <el-row>
      <el-card>
      <div slot="header" class="clearfix">
        <span>{{ labels.custom.filter.header }}</span>

      </div>
      <FilterTree :data="arr_tree_data" />
      </el-card>
    </el-row>

    <!-- clear filter button-->
    <el-row>
      <el-button v-if="filter_length > 0" @click="filterClear()" style="width: 100%">
        {{ labels.result.clear_filter }}
      </el-button>
    </el-row>

    <!-- hisotry button-->
    
    <el-row>
      <el-card>
        <el-table :data="searchHistory" @cell-click="historySearch" border
          style="width: 100%; cursor: pointer;">
          <el-table-column prop="text" :label="labels.result.history" style="width: 100%"  ></el-table-column>
        </el-table>
      </el-card>
    </el-row>

  </div>
</template>

<script>

import SearchUtils from '../utils/SearchUtils'
import FilterTree from './FilterTree'

export default {
  name: 'ResultRightPanel',
  components: {
    FilterTree
  },
  data() {
    return {

    }
  },
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    searchHistory() {
      var ret_history = [];
      for (var idx in this.$store.state.list_search_history) {
        var obj_history = { text: this.$store.state.list_search_history[idx] }
        ret_history.push(obj_history)
      }
      return ret_history;
      // return this.$store.state.list_search_history;
    },
    filter_length() {
      return this.$store.getters.filter_length;
    },
    aggregations() {
      return this.$store.getters.result_aggs;
    },
    arr_tree_data() {
      return SearchUtils.aggs2TreeData(this.aggregations);
    }
  },
  methods: {
    debug(){
      console.log("[debug] this.arr_tree_data " + JSON.stringify(this.arr_tree_data));
      console.log("[debug] this.filter_length " + JSON.stringify(this.filter_length));
    },
    historySearch: function(data) {
      console.log("historySearch: " + JSON.stringify(data));
      var payload = {}
      payload.query = SearchUtils.getBasicSearchQuery(data.text);
      payload.aggs = SearchUtils.getAggregations();
      this.$store.dispatch("updateSearchHistory", data.text);
      this.$store.dispatch("doBasicSearch", payload);
    },
    filterClear: function() {
      this.isFiltered = false;
      this.$store.dispatch("clearFilter");
    }
  },
  created() {
    console.log("RightPanel created ==>");
    console.log("aggs: " + JSON.stringify(this.aggregations));
  }
}


</script>

<style scoped>
.itemhover:hover {
  background-color: #007bff;
  color: white;
}

</style>
