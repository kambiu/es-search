<template>
  <div>
    <b-row>
      <b-col sm="9" id="main">
        <b-row>
          <b-col class="response-info">
            <ResponseInfo />
          </b-col>
          <b-col>
            <b-form-group horizontal :label="labels.result.sort_by.label" label-class="text-md-left" label-for="num_results">
              <b-form-select v-model="result_sort_by" :options="sortby_options" @input="changeSorting(result_sort_by)"  />
            </b-form-group>
          </b-col>
        </b-row>        
        <ResultNormal v-for="item in list_result" :result="item" :key="item._id" />
      </b-col>
      <b-col sm="3" id="right-panel">
        <ResultRightPanel />
        <!--
        <ResultRightPanel 
          @action="rightPanelAction($event)"
          :searchHistory="searchHistory"
          :aggregations="searchResults.aggregations"
          :resultFiltered="resultFiltered"
        />
        -->
      </b-col>
    </b-row>
    <button class="hidden" v-on:click="debug">Debug</button>
    <b-row align-h="center" id="pageNavigation">
      <b-pagination-nav 
        base-url="#" 
        :limit="10" 
        :number-of-pages="numPage" 
        v-show="searchResults.hits.total != 0"
        v-model="field_current_page" 
        v-on:input="pageSearch(field_current_page)" 
        :next-text="labels.result.pagination.next_page" />
    </b-row>
  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'
import ResponseInfo from './ResponseInfo.vue'
import ResultRightPanel from './ResultRightPanel.vue'

export default {
  name: 'ResultContainer',
  data() {
    return {
      field_current_page: this.current_page,      
      result_sort_by: "_score"
    }
  },
  computed: {
    sortby_options() {
      return [
        { value: "_score", text: this.labels.result.sort_by.score },
        { value: "date_modified", text: this.labels.result.sort_by.date },
      ]
    },
    numPage: function() {
      return Math.ceil(this.result_hits * 1.0 / this.page_size);
    },
    /* vuex */
    labels() {
      return this.$store.state.labels;
    },
    list_result() {
      return this.$store.getters.list_result;
    },
    searchResults() {
      return this.$store.state.es_response;
    },
    result_hits() {
      return this.$store.getters.result_hits;
    },
    page_size() {
      return this.$store.getters.page_size;
    },
    current_page() {
      return this.$store.getters.current_page;
    }
  },
  props: [
    "resultFiltered",
  ],    
  components: {
    ResultNormal,
    ResponseInfo,
    ResultRightPanel
  },
  methods: {
    debug: function(){
      // console.log(this.result_sort_by);
    },
    pageSearch: function(page) {
      this.$store.dispatch("changePage", page);
    },
    changeSorting: function(sort_method) {
      this.field_current_page = 1;
      this.$store.dispatch("changeSorting", sort_method);

    },
    rightPanelAction: function(event) {
      this.$emit("action", event);
    }
  },
  created(){
    console.log("ResultContainer created ==>");
  }
}

</script>

<style scoped>

#pageNavigation {
  margin-top: 20px;
}

.response-info {
  margin-left: 8px;
  margin-top: 3px;
  margin-bottom: 10px;
}
</style>
