<template>
  <div>
    <b-row>
      <b-col sm="8" class="my-0">
        <ResponseInfo :time="searchResults.took" :hits="searchResults.hits.total" />
        <ResultNormal v-for="item in searchResults.hits.hits" :result="item" :key="item._id" />
      </b-col>
      <b-col sm="3" class="my-0">
        <div>Search History:</div>
        <div>
          <b-list-group class="listGrp">
            <b-list-group-item v-for="(item, index) in searchHistory" :key="index" v-on:click="historySearch(item)"
            class="listSearchHistory" href="#">{{item}}</b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
    </b-row>
    <button class="hidden" v-on:click="debug">Debug</button>
    <b-row align-h="center" id="pageNavigation">
      <!--<b-pagination-nav :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" />-->
      <b-pagination-nav 
        base-url="#" 
        :limit="10" 
        :number-of-pages="numPage" 
        v-show="searchResults.hits.total != 0"
        v-model="currentPage" 
        v-on:input="pageSearch(currentPage)" 
        next-text="Next" />
    </b-row>
  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'
import ResponseInfo from './ResponseInfo.vue'
import ns from '../utils/NameSpace.js'

export default {
  name: 'ResultContainer',
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {
    numPage: function() {
      return Math.ceil(this.searchResults.hits.total * 1.0 / this.pageSize);
    }
  },
  props: [
    "searchHistory",
    "searchResults",
    "pageSize"
  ],    
  components: {
    ResultNormal,
    ResponseInfo
  },
  methods: {
    debug: function(){
      console.log("this.searchResults.hits.total: " + this.searchResults.hits.total)
      console.log("this.searchResults.hits.hits.length(): " + this.searchResults.hits.hits.length)
      console.log("this.numPage: " + this.numPage);
    },
    hoverList: function(evt) {
      if (!evt) {
        evt = window.event; 
      }
      
      var el = (event.target || event.srcElement);
      el.setAttribute('active', "");
    },
    historySearch: function(text_history) {
      // this.$emit("action", {text: text_history});
      this.$emit("action", {action: ns.resultAction.doBasicSearch, query: {text: text_history}});
    },
    pageSearch: function(page) {
      console.log("-------------change page--------------")
      console.log("change page: " + page);
      // this.$emit("action", {page: page});
      this.$emit("action", {action: ns.resultAction.changePage, query: {"page": page}});
    }
  }
}


</script>

<style scoped>

.listSearchHistory:hover {
  background-color: #007bff;
  color: white;
}

#pageNavigation {
  margin-top: 20px;
}
</style>
