<template>
  <div class="search-container">
    <b-container fluid>
      <b-row align-h="center" align-v="center" class="search_input">
        <b-col md="10">
          <AdvanceSearch v-show="show_advanced_page" @eSearchAction="handleSearch($event)" />
          <BasicSearch v-show="show_basic_page"  @eSearchAction="handleSearch($event)" />          
        </b-col>
      </b-row>
      <transition name="fade">
        <b-row align-h="center" align-v="center" class="search_result" v-if="show_result_page">
          <b-col md="10">
            <ResultContainer :searchHistory="list_search_history" :searchResults="search_results" @eSearchAction="handleSearch($event)" />
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
      search_results: null
    }
  },
  methods: {
    handleSearch: function(event){
      if (event == "adv") {
        /* call advanced search*/
        this.show_result_page = false;
        this.show_basic_page = false;
        this.show_advanced_page = true;
      } else {
        /* submit search*/

        var is_basic_search = (event.text ? true : false);

        // update search history
        this.updateSearchHistory(is_basic_search, event) 
        // if (is_basic_search) {
        //   this.updateSearchHistory() 
        // }

        // load result
        this.parseQueryLoadResult(is_basic_search, event);

        // load aggregation
        // ...

        
      }    
    },
    updateSearchHistory: function(is_basic_search, query){
      var text_submitted = (is_basic_search ? query.text : query.text_or);
      console.log(text_submitted);
      //updat ehistory
      this.list_search_history.unshift(text_submitted);    
      this.list_search_history = this.list_search_history.slice(0, 5);          
    },

    parseQueryLoadResult: function(is_basic_search, query){
      // submit text to elatsicsearch

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
      console.log("parseAndSendQuery------");
      console.log(query);
      
      /* define must need filed */
      var q_from = 0; //TODO pagingation
      var q_size = 10;
      var q_source = {excludes: ["content"] };
      var q_highlight = {
        fields: { content: {} }
      };
      var q_sort = "_score";
      var q_query = null;
      // var q_scope = "";
      var q_index = "*";

      if (is_basic_search) {
        console.log("basic query");
         q_query = {
          match: {
            content: query.text
          }
        }
      } else {
        console.log("advacned query");
        q_from = 0;
        q_size = query.max_results;
        //TODO
        // q_scope = query.scope;
        q_index = query.repository;
        // TODO meta
        // scope: "all",
        // date: {
        //   from: null,
        //   to: null
        // },  

        q_query = {
          bool: {
            must: [],
            must_not: []
          }
        }

        if (query.text_or) {
          q_query.bool.must.push(
            {
              match: { content: query.text_or } 
            }
          )
        } 

        if (query.text_and) {
          q_query.bool.must.push(
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

        if(query.text_exact){
          q_query.bool.must.push(
            { 
              match_phrase: { content: query.text_exact }
            }
          )
        } 

        if(query.text_not){
          q_query.bool.must_not.push(
            {
              match: { content: query.text_not }
            }
          )
        }

        // q_query = {
        //   bool: {
        //     must: [
        //       { 
        //         match: { content: query.text_or } 
        //       },
        //       { 
        //         match: { 
        //           content: {
        //             query: query.text_and,
        //             operator: "and"
        //           }                  
        //         } 
        //       },
        //       { 
        //         match_phrase: { content: query.text_exact } 
        //       }
        //     ]
        //     ,
        //     must_not: {
        //       match: {
        //         content: query.text_not
        //       }
        //     }            
        //   }
        // }
      }

      console.log(q_query);
      //TODO show filter panel on aggregation?
      console.log("Submitting search  -------------------->>");

      var me = this; /* important , callback functino cannot access to this variable*/
      esclient.search({
        index: q_index,
        body: {
          from: q_from, 
          size: q_size,
          _source: q_source,
          query: q_query,
          highlight: q_highlight,
          sort: q_sort
        }
      }).then(function (body) {        
        me.search_results = body;
         // toggle component display
        me.show_result_page = true;
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

</style>
