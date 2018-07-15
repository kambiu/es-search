<template>
  <div>
    <!-- debug button
    <el-button @click="debug">debug</el-button> -->
    <!-- tree -->
    <el-tree :data="tree_data" @node-click="filterSearch" size="medium" default-expand-all></el-tree>
  </div>
</template>

<script>

import SearchUtils from '../utils/SearchUtils'

export default {
  name: 'FilterTree',
  props: [
    "data"
  ],
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    tree_data: function() {
      // root
      var arr_tree = [];
      var self = this;
      this.data.forEach(function(field_tree) {
        var sub_tree = {};
        // level 1
        // sub_tree.label = field_tree.field_name;
        sub_tree.label = self.labels.custom.filter[field_tree.field_name];
        // level 2
        sub_tree.children = [];
        field_tree.buckets.forEach(function(bucket) {
          sub_tree.children.push(SearchUtils.getTreeNodeData(field_tree.field_name, field_tree.aggs_type, bucket));
        });
        arr_tree.push(sub_tree)
      });
      return arr_tree;
    }
  },
  methods: {
    debug(){
      // console.log("[debug] this.tree_data " + JSON.stringify(this.tree_data));

    },
    filterSearch: function(node_data) {
      if (node_data.filter_param) {
        console.log("filterSearchTerms: " + JSON.stringify(node_data.filter_param));
        this.isFiltered = true; //TODO
        this.$store.dispatch("addFilter", node_data.filter_param);
      }
    },
  },
  created() {
    console.log("FilterTable created ==>");
    console.log("FilterTable date ==>" +  JSON.stringify(this.data));
    console.log("FilterTable tree_data ==>" +  JSON.stringify(this.tree_data));
  }
}

</script>

<style scoped>

</style>
