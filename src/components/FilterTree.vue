<template>
  <div>
    <!--{{ tree }} -->
    <el-tree :data="tree_data" @node-click="nodeClick" size="large" default-expand-all></el-tree>
  <!--
    <div v-for="(item, index) in arr_terms_filter" :key="'term_' + index"> 
      <div>{{ item.display_name }}</div>
      <div>
        <b-list-group class="listGrp">
          <b-list-group-item v-for="(doc_count, field_value) in item.values" :key="field_value" v-on:click="filterSearchTerms(item.field_name, field_value)"
          class="itemhover" href="#">{{ field_value + " (" + doc_count + ")"}}</b-list-group-item>
        </b-list-group>
      </div>
      <br /-->
    </div>
</template>

<script>
export default {
  name: 'FilterTree',
  props: [
    "tree"
  ],
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    tree_data: function() {
      var arr_tree = []
      var tmp_obj = {}
      tmp_obj.label = this.labels.custom.filter[this.tree.field_name]
      tmp_obj.children = []
      for (var key in this.tree.values) {
        tmp_obj.children.push({label: key + " (" + this.tree.values[key] + ")"})
      }

      arr_tree.push(tmp_obj)
      return arr_tree;
    }
  },
  methods: {
    debug(){
      console.log("[debug] this.isFiltered " + this.test);

    },
    nodeClick(data){
      console.log("[nodeClick] with node: " + data);
    }
  },
  created() {
    console.log("FilterTable created ==>");
    // console.log("Tree: " + JSON.stringify(this.tree));
    // console.log("Tree.values: " + JSON.stringify(this.tree.values));

    // for (var key in this.tree.values) {
    //   console.log(key, this.tree.values[key]);
    // }
  }
}

</script>

<style scoped>

</style>
