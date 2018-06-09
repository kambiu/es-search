<template>
  <div class="search-container">
    <b-container fluid>
      <b-row align-h="center" align-v="center" class="search_input">
        <b-col md="10">
          <AdvanceSearch v-show="show_advanced_page" @action="advancedAction($event)" />
          <BasicSearch v-show="show_basic_page"  @action="basicAction($event)" />          
        </b-col>
      </b-row>
      <transition name="fade">
        <b-row align-h="center" align-v="center" class="search_result" v-if="show_result_page">
          <b-col md="10">
            <ResultContainer 
                :pageSize="current_query.size"
                :searchHistory="list_search_history" 
                :searchResults="search_results" 
                @action="resultAction($event)" />
          </b-col>
        </b-row>
      </transition>
    </b-container>
  </div>
</template>

<script>
import ResultContainer from './ResultContainer.vue'
import AdvanceSearch from './AdvanceSearch.vue'
import BasicSearch from './BasicSearch.vue'
import esclient from '../utils/ESHelper.js'
import ns from '../utils/NameSpace.js'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch,
    BasicSearch
  },
  data() {
    return {
      show_basic_page: true,
      show_result_page: false,
      show_advanced_page: false,
      list_search_history: [
        "Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"
      ],
      search_results: null,
      search_type: ns.searchType.basic,
      current_query: {}
    }
  },
  methods: {
    showAdvancedSearchPage: function(){
      this.show_result_page = false;
      this.show_basic_page = false;
      this.show_advanced_page = true;
    },
    showResultPage: function(){
      this.show_result_page = true;
      this.show_basic_page = true;
      this.show_advanced_page = false;
    },
    /* actions for basic search page */
    basicAction: function(event) {
      if (event.action == ns.basicAction.search) {
        console.log("search action in basicAction()");
        this.search_type = ns.searchType.basic
        console.log(event.query);
        this.resetInputBoxValue(); // this is a new search
        this.updateSearchHistory(ns.searchType.basic, event.query);
        this.parseQueryLoadResult(ns.searchType.basic, event.query);
        
      } else if (event.action == ns.basicAction.showAdvancedPage) {
        console.log("show advanced action in basicAction()");
        this.showAdvancedSearchPage();
      }      
    },
    /* actions from advanced search page */
    advancedAction: function(event) {
      console.log("search action in advancedAction()");
      this.search_type = ns.searchType.advanced;
      this.resetInputBoxValue(); // this is a new search
      this.updateSearchHistory(ns.searchType.advanced, event.query);
      this.parseQueryLoadResult(ns.searchType.advanced, event.query);
    },
    /* actions from results */
    resultAction: function(event) {
      if (event.action == ns.resultAction.changePage) {
        console.log("change page to ..." + event.query.page)
        //no reset, no update history
        this.current_query.from = (event.query.page - 1) * this.current_query.size;
        console.log("this.current_query.from: " + this.current_query.from)
        this.queryLoadResult();

      } else if (event.action == ns.resultAction.doBasicSearch) {
        this.search_type = ns.searchType.basic;
        this.resetInputBoxValue(); // this is a new search
        this.updateSearchHistory(ns.searchType.basic, event.query);
        this.parseQueryLoadResult(ns.searchType.basic, event.query);
      }
    },
    updateSearchHistory: function(searchType, query){
      console.log("searchType in updateSearchHistory(): " + searchType)
      var text_submitted = "";
      if (searchType == ns.searchType.basic)
        text_submitted = query.text;
      else if (searchType == ns.searchType.advanced)
        if (query.text_or)
          text_submitted += "+OR(" +query.text_or+ ")"
        if (query.text_and)
          text_submitted += "+AND(" +query.text_and+ ")"
        if (query.text_exact)
          text_submitted += "+EXACT(" +query.text_exact+ ")"
        if (query.text_not)
          text_submitted += "+NOT(" +query.text_not+ ")"

      console.log(text_submitted);
      //updat ehistory
      this.list_search_history.unshift(text_submitted);    
      this.list_search_history = this.list_search_history.slice(0, 5);          
    },
    resetInputBoxValue: function() {
      this.current_query = {};
      this.current_query.from = 0;
      this.current_query.size = 10;
      this.current_query.source = {excludes: ["content"] };
      this.current_query.highlight = { fields: { content: {} } };
      this.current_query.sort = "_score";
      this.current_query.query = null;
      // var q_scope = "";
      this.current_query.index = "*";
    },
    parseQueryLoadResult: function(searchType, query) {
      this.parseQuery(searchType, query);
      this.queryLoadResult();
    },
    parseQuery: function(searchType, query) {
      /* require attributes
        text basic
        any
        not
        exact
        none
        from size
        print fields
        sort by
        fieldtext condition
        aggregation condition

      */
      console.log("parseQuery------");
      if (searchType == ns.searchType.basic) {
        console.log("parseQuery Basic------");
        //TODO change to simple query allowing AND OR opertaor
        this.current_query.query = {
          query_string: {
            default_field : "content",
            query : query.text
          }
        };
      } else if (searchType == ns.searchType.advanced) {
        console.log("parseQuery Advanced------");
        this.current_query.from = 0;
        this.current_query.size = query.max_results;
        this.current_query.index = query.repository;
        // TODO meta: scope, date from, to
        this.current_query.query = {
          bool: {
            must: [],
            must_not: []
          }
        }
        // Any of these words
        if (query.text_or) {
          this.current_query.query.bool.must.push(
            {
              match: { content: query.text_or } 
            }
          )
        } 
        // All of these words
        if (query.text_and) {
          this.current_query.query.bool.must.push(
            {
              match: { 
                content: {
                  query: query.text_and, 
                  operator: "and"
                }
              }
            }
          )
        } 
        // Exact phrase
        if(query.text_exact){
          this.current_query.query.bool.must.push(
            { 
              match_phrase: { content: query.text_exact }
            }
          )
        } 
        // None of these words
        if(query.text_not){
          this.current_query.query.bool.must_not.push(
            {
              match: { content: query.text_not }
            }
          )
        }      
      } // end parse advanced search query
    },
    queryLoadResult: function(){
      // submit text to elatsicsearch
      console.log(this.current_query);
      //TODO show filter panel on aggregation?
      console.log("Submitting search  -------------------->>");

      var me = this; /* important , callback functino cannot access to this variable*/
      esclient.search({
        index: this.current_query.index,
        body: {
          from: this.current_query.from, 
          size: this.current_query.size,
          _source: this.current_query.source,
          query: this.current_query.query,
          highlight: this.current_query.highlight,
          sort: this.current_query.sort
        }
      }).then(function (body) {        
        me.search_results = body;
         // toggle component display
        me.showResultPage();
      }, function (error) {
        console.trace(error.message);
        console.log(">>>>>>>>>>>>>>>>> Error made <<<<<<<<<<<<<<<<<<");
      });

      console.log("end parseAndSendQuery ---------------");
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

strong, em{
  color: #dd4b39 !important;
  font-weight: bold;  
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.transparent {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0.2);
}

.hidden {
  display: none;
}

.hasError {
  border-color: red;
  border-width: 2px;
}
</style>
