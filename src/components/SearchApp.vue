<template>
  <div class="search-container">
    <button v-on:click="debug" hidden>Debug</button>
    <b-container fluid>
      <b-row align-h="center">
        <b-col md="4">
          <b-form-group horizontal
                  :label="labels.common.language" label-class="text-sm" label-for="display_language">
            <b-form-select id="display_language" v-model="lang" :options="option_lang" @input="changeLanguage()"></b-form-select>
          </b-form-group>       

        </b-col>
      </b-row>
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
                :resultFiltered="(this.current_query.query.bool.filter.length > 0)"
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
import appcfg from '../config.js'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch,
    BasicSearch
  },
  created() {
    console.log("-----created-----");
    // for (let lang of appcfg.languages) {
    //    console.log(lang);
    // }
    //TODO load from cookies and set language
    var cookie_lang = this.$cookies.get("user_language");
    console.log("lang from cookies: " + cookie_lang);
    if (cookie_lang){
      console.log("Set lang to " + cookie_lang);
      this.$store.dispatch("changeLanguage", cookie_lang);
      this.lang = cookie_lang;
    } else{
      console.log("Set lang to en-us");
      this.$store.dispatch("changeLanguage", "en-us");
      this.lang = "en-us";
    }
  },
  data() {
    return {
      lang: "en-us",
      show_basic_page: true,
      show_result_page: false,
      show_advanced_page: false,
      list_search_history: [
        "Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"
      ],
      search_results: null,
      search_type: ns.searchType.basic,
      current_query: {},
      // option_lang: [
      //   { value: null, text: 'Please select some item' },
      //   { value: 'a', text: this.labels.name },
      //   { value: 'b', text: 'Default Selected Option' }
      // ]
    }
  },
  computed: {
    option_lang: function() {
      var ret_arr = []
      for (let lang of appcfg.languages) {
        ret_arr.push({
          "value": lang,
          "text": lang
        });
      }
      return ret_arr;
    },
    // labels: function() {
    //   var labels_lang = require("../assets/language/" + this.lang + ".json")
    //   return labels_lang
    // },
    labels() {
      return this.$store.state.labels;
    },
  },
  methods: {
    debug() {
      console.log("----------- debug message -----------");
      console.log(this.labels);
    },
    changeLanguage: function() {
      console.log("Change to " + this.lang);
      
      console.log("Save to cookie user_language" + this.lang);
      this.$cookies.set("user_language", this.lang, 60 * 60 * 24 * 180); //180 days

      this.$store.dispatch("changeLanguage", this.lang);
      // console.log(this.labels);
    },
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
      else if (event.action == ns.resultAction.changeSorting) {

        if (event.query.sort.includes("date")) {
          console.log("ES^--->>")
          this.current_query.sort = {}
          this.current_query.sort[event.query.sort] = {
            order: "desc"
          }

          // event.query.sort = { sort_field_name: { order: "desc" } }
        } else {
          this.current_query.sort = event.query.sort;
        }        
        this.current_query.from = 0;
        console.log("this.current_query.sort: " + this.current_query.sort)
        this.queryLoadResult();

      } else if (event.action == ns.resultAction.filterSearch) {
        console.log("Filter sth: " + event.filter);
        // console.log("Filter sth: " + event.filter.field_name + " > " + event.filter.field_value);
        this.current_query.from = 0;
        this.current_query.query.bool.filter.push(event.filter);
        this.queryLoadResult();

      } else if (event.action == ns.resultAction.clearFilter) {
        this.current_query.from = 0;
        this.current_query.query.bool.filter = [];
        this.queryLoadResult();
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
      this.current_query.aggs = null;
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
          bool: {
            must: [
              { 
                query_string: {
                  default_field : "content",
                  query : query.text
                }
              }
            ],
            must_not: [],
            filter: []
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
            must_not: [],
            filter: []
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

        // date

        if (query.date.from && query.date.to) {
          this.current_query.query.bool.must.push(
            {
              range: { 
                date_modified: {
                  gte: query.date.from + " 00:00:00",
                  lte: query.date.to + " 00:00:00"
                }
              }
            }
          )
        } else if (query.date.from) {
          this.current_query.query.bool.must.push(
            {
              range: { 
                date_modified: { gte: query.date.from }
              }
            }
          )
        } else if (query.date.to) {
          this.current_query.query.bool.must.push(
            {
              range: { 
                date_modified: { lte: query.date.to }
              }
            }
          )
        }
      } // end parse advanced search query

      /* Start aggregation */ 
      this.current_query.aggs = {}

      //terms
      for (let field of appcfg.search.aggregation.terms_fields) {
        this.current_query.aggs["terms_" + field] = {
          "terms": { "field": field }
        }
      }

      //range
      for (let obj of appcfg.search.aggregation.range_fields) {
        this.current_query.aggs["ranges_" + obj.field_name] = {
          "range": {
            "field": obj.field_name,
            "ranges": obj.groups
          }
        }
      }
    },
    queryLoadResult: function(){
      // submit text to elatsicsearch
      // console.log(this.current_query);
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
          sort: this.current_query.sort,
          aggs: this.current_query.aggs
        }
      }).then(function (body) {        
        me.search_results = body;
         // toggle component display
        //  console.log("Return >>>>>> " + JSON.stringify(body))
        me.showResultPage();
      }, function (error) {
        console.error(error.message);
        console.log(">>>>>>>>>>>>>>>>> Error made <<<<<<<<<<<<<<<<<<");
        //TODO make alert about no living connections
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
