import Vue from 'vue';
import Vuex from 'vuex';
// import ns from  '../utils/NameSpace'
import esclient from '../utils/ESHelper.js'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    layout: {
      show_basic_search_page: true,
      show_advanced_search_page: false,
      show_result_page: false,
    },
    labels: null,
    trends: ["sugar", "salt", "1"],
    list_search_history: [
      "Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"
    ],
    es_response: null,

    // current_request: flatten structure
    cr_from: 0,
    cr_size: 10,
    cr_source: {excludes: ["content"] },
    cr_highlight: { fields: { content: {} } },
    cr_sort: "_score",
    cr_query: null,
    cr_index: "*",
    cr_aggs: null
  },
  getters: {
    list_result: state => {
      return state.es_response.hits.hits;
    },
    result_response_time: state => {
      return state.es_response.took;
    },
    result_hits: state => {
      return parseInt(state.es_response.hits.total);
    },
    result_aggs: state => {
      return state.es_response.aggregations;
    },
    page_size: state=> {
      return parseInt(state.cr_size);
    },
    current_page: state=> {
      var from = parseInt(state.cr_from);
      var size = parseInt(state.cr_size);
      var page = (from / size) + 1;
      return page;
    }
  },
  mutations: {
    changeLanguage (state, new_labels) {
      state.labels = new_labels;
    },
    updateESResponse(state, updated_response) {
      state.es_response = updated_response;
    },
    changeShowBasicSearchPage(state, display) {
      //console.log("changeShowBasicSearchPage: " + display);
      state.layout.show_basic_search_page = display;
    },
    changeShowAdvancedSearchPage(state, display) {
      //console.log("changeShowAdvancedSearchPage: " + display);
      state.layout.show_advanced_search_page = display;
    },
    changeShowResultPage(state, display) {
      //console.log("changeShowResultPage: " + display);
      state.layout.show_result_page = display;
    },
    resetCurrentRequest(state) {
      state.cr_from = 0;
      state.cr_size = 10;
      state.cr_source = {excludes: ["content"] };
      state.cr_highlight = { fields: { content: {} } };
      state.cr_sort = "_score";
      state.cr_query = null;
      state.cr_index = "*";
      state.cr_aggs = null;
    },
    updateSearchHistory(state, history) {
      state.list_search_history = history;
    },
    updateCurrentRequestQuery(state, updatedQuery) {
      state.cr_query = updatedQuery;
    },
    updateCurrentRequestAggs(state, updatedAggs) {
      state.cr_aggs = updatedAggs;
    },
    updateFrom(state, updatedStartFromResult) {
      state.cr_from = updatedStartFromResult;
    },
    updateSorting(state, updateSort) {
      state.cr_sort = updateSort;
    },
    addFilter(state, filter) {
      state.cr_query.bool.filter.push(filter);
    },
    clearFilter(state) {
      state.cr_query.bool.filter = [];
    },
    updatePageSize(state, updateSize) {
      state.cr_size = parseInt(updateSize);
    }
  },

  // actions start here ...
  
  actions: {
    changeLanguage(context, payload) {
      var new_labels = require("../assets/language/" + payload + ".json");
      context.commit("changeLanguage", new_labels);
    },
    doBasicSearch(context, payload) {
      console.log("store action: doBasicSearch() = > received payload ...");
      console.log(JSON.stringify(payload));
      context.commit("resetCurrentRequest");
      context.commit("updateCurrentRequestQuery", payload.query)
      context.commit("updateCurrentRequestAggs", payload.aggs)
      context.dispatch("queryLoadResult");
    },
    doAdvancedSearch(context, payload) {
      console.log("store action: doAdvancedSearch() = > received payload ...");
      console.log(JSON.stringify(payload));
      context.commit("resetCurrentRequest");
      
      // context.commit("updateIndex", payload.index);
      context.commit("updatePageSize", payload.size);
      context.commit("updateCurrentRequestQuery", payload.query);
      context.commit("updateCurrentRequestAggs", payload.aggs);
      context.dispatch("queryLoadResult");
    },
    showAdvancedSearchPage: function(context) {
      console.log("showAdvancedSearchPage");
      context.commit("changeShowBasicSearchPage", false);      
      context.commit("changeShowAdvancedSearchPage", true);
      context.commit("changeShowResultPage", false);
    },
    showResultPage: function(context) {
      console.log("showResultPage");
      context.commit("changeShowBasicSearchPage", true);      
      context.commit("changeShowAdvancedSearchPage", false);
      context.commit("changeShowResultPage", true);
    },
    updateSearchHistory: function(context, new_text) {
      console.log("context.state.list_search_history: " + context.state.list_search_history);
      // console.log("searchType in updateSearchHistory(): " + searchType)
      // var text_submitted = "";
      // if (search_type == ns.searchType.basic)
      //   text_submitted = context.basic_request.text;
      // else if (searchType == ns.searchType.advanced)
      //   if (context.advanced_request.text_or)
      //     text_submitted += "+OR(" +context.advanced_request.text_or+ ")"
      //   if (query.text_and)
      //     text_submitted += "+AND(" +context.advanced_request.text_and+ ")"
      //   if (query.text_exact)
      //     text_submitted += "+EXACT(" +context.advanced_request.text_exact+ ")"
      //   if (query.text_not)
      //     text_submitted += "+NOT(" +context.advanced_request.text_not+ ")"

      // console.log(text_submitted);
      // //updat ehistory
      // this.list_search_history.unshift(text_submitted);    
      // this.list_search_history = this.list_search_history.slice(0, 5);
      var new_list = []
      for (var item_history of context.state.list_search_history) {
        new_list.push(item_history);
      }
      new_list.unshift(new_text);
      context.commit("updateSearchHistory", new_list.slice(0, 5));
    },
    queryLoadResult: function(context) {
      // submit text to elatsicsearch
      // console.log(this.current_request);
      console.log("queryLoadResult ---->>");

      // console.log(context.state.current_request);
      // var me = this; /* important , callback functino cannot access to this variable*/
      esclient.search({
        index: context.state.cr_index,
        body: {
          from: context.state.cr_from, 
          size: context.state.cr_size,
          _source: context.state.cr_source,
          query: context.state.cr_query,
          highlight: context.state.cr_highlight,
          sort: context.state.cr_sort,
          aggs: context.state.cr_aggs
        }
      }).then(function (es_response) {
        console.log("Finished loading query");
        context.commit("updateESResponse", es_response);
        context.dispatch("showResultPage");
      }, function (error) {
        console.log(">>>>>>>>>>>>>>>>> Error Start <<<<<<<<<<<<<<<<<<");
        console.error(error.message);
        console.log(">>>>>>>>>>>>>>>>> Error End <<<<<<<<<<<<<<<<<<");
        //TODO make alert about no living connections
      });

      console.log("end parseAndSendQuery ---------------");
    },
    changePage: function(context, payload) {
      console.log("changePage() to page " + payload);
      var start_from_result = (payload - 1) * context.getters.page_size;
      console.log("start_from_result: " + start_from_result)
      context.commit("updateFrom", start_from_result);
      context.dispatch("queryLoadResult");
    },
    changeSorting: function(context, payload) {

      console.log("changeSorting() to " + payload);

      var new_sort = null;
      if (payload.includes("date")) {
        new_sort = {}
        new_sort[payload] = { order: "desc" }
      } else {
        new_sort = payload;
      }

      context.commit("updateSorting", new_sort);
      context.commit("updateFrom", 0);
      context.dispatch("queryLoadResult");

    },
    addFilter: function(context, payload) {
      console.log("addFilter");
      context.commit("updateFrom", 0);
      context.commit("addFilter", payload);
      context.dispatch("queryLoadResult");
    },
    clearFilter: function(context) {
      console.log("clearFilter");
      context.commit("clearFilter");
      context.dispatch("queryLoadResult");
    }
  }
})