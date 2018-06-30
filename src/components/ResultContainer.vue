<template>
  <div>
    <b-row>
      <b-col sm="9" id="main">
        <b-row>
          <b-col class="response-info">
            <ResponseInfo :time="searchResults.took" :hits="searchResults.hits.total" />
          </b-col>
          <b-col>
            <b-form-group horizontal :label="labels.result.sort_by.label" label-class="text-md-left" label-for="num_results">
              <b-form-select v-model="result_sort_by" :options="sortby_options" @input="changeSorting()"  />
            </b-form-group>
          </b-col>
        </b-row>        
        <ResultNormal v-for="item in searchResults.hits.hits" :result="item" :key="item._id" />
      </b-col>
      <b-col sm="3" id="right-panel">
        <ResultRightPanel 
          @action="rightPanelAction($event)"
          :searchHistory="searchHistory"
          :aggregations="searchResults.aggregations"
          :resultFiltered="resultFiltered"
        />
      </b-col>
    </b-row>
    <button class="hidden" v-on:click="debug">Debug</button>
    <b-row align-h="center" id="pageNavigation">
      <b-pagination-nav 
        base-url="#" 
        :limit="10" 
        :number-of-pages="numPage" 
        v-show="searchResults.hits.total != 0"
        v-model="currentPage" 
        v-on:input="pageSearch(currentPage)" 
        :next-text="labels.result.pagination.next_page" />
    </b-row>
  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'
import ResponseInfo from './ResponseInfo.vue'
import ns from '../utils/NameSpace.js'
import ResultRightPanel from './ResultRightPanel.vue'

export default {
  name: 'ResultContainer',
  data() {
    return {
      currentPage: 1,      
      result_sort_by: "_score"
    }
  },
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    sortby_options() {
      return [
        { value: "_score", text: this.labels.result.sort_by.score },
        { value: "date_modified", text: this.labels.result.sort_by.date },
      ]
    },
    numPage: function() {
      return Math.ceil(this.searchResults.hits.total * 1.0 / this.pageSize);
    },
    searchResults() {
      return this.$store.state.es_response;
    }
  },
  props: [
    "searchHistory",
    // "searchResults",
    "pageSize",
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
    // historySearch: function(text_history) {
    //   // this.$emit("action", {text: text_history});
    //   this.$emit("action", {action: ns.resultAction.doBasicSearch, query: {text: text_history}});
    // },
    pageSearch: function(page) {
      console.log("-------------change page--------------")
      console.log("change page: " + page);
      // this.$emit("action", {page: page});
      this.$emit("action", {action: ns.resultAction.changePage, query: {"page": page}});
    },
    changeSorting: function() {
      // console.log("ResultContainer.changeSorting(): change sorting to " + this.result_sort_by);
      this.$emit("action", {action: ns.resultAction.changeSorting, query: {"sort": this.result_sort_by}});
    },

    rightPanelAction: function(event) {
      this.$emit("action", event);
    }
  },
  created(){
    console.log("Result Container entered");
    console.log(this.searchResults);
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
