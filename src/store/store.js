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
    //TODO
    current_request: {},
    es_response: null,
    err: {
      fields: {
        texts: false
      },
      message: ""
    }
  },
  getters: {
    list_result: state => {
      return state.es_response.hits.hits
    }
  },
  mutations: {
    changeLanguage (state, new_labels) {
      state.labels = new_labels;
    },
    changeBasicRequest(state, new_request) {
      state.baisc_request = new_request;
    },
    changeAdvancedRequest(state, new_request) {
      state.advanced_request = new_request;
    },
    updateESResponse(state, updated_response) {
      state.es_response = updated_response;
    },
    changeShowBasicSearchPage(state, display) {
      console.log("changeShowBasicSearchPage: " + display);
      state.layout.show_basic_search_page = display;
    },
    changeShowAdvancedSearchPage(state, display) {
      console.log("changeShowAdvancedSearchPage: " + display);
      state.layout.show_advanced_search_page = display;
    },
    changeShowResultPage(state, display) {
      console.log("changeShowResultPage: " + display);
      state.layout.show_result_page = display;
    },
    resetCurrentRequest(state) {
      state.current_request = {};
      state.current_request.from = 0;
      state.current_request.size = 10;
      state.current_request.source = {excludes: ["content"] };
      state.current_request.highlight = { fields: { content: {} } };
      state.current_request.sort = "_score";
      state.current_request.query = null;
      state.current_request.index = "*";
      state.current_request.aggs = null;
    },
    updateSearchHistory(state, history) {
      state.list_search_history = history;
    },
    updateCurrentRequestQuery(state, updatedQuery) {
      state.current_request.query = updatedQuery;
    },
    updateCurrentRequestAggs(state, updatedAggs) {
      state.current_request.aggs = updatedAggs;
    },
  },

  // actions start here ...
  
  actions: {
    changeLanguage(context, payload) {
      var new_labels = require("../assets/language/" + payload + ".json");
      context.commit("changeLanguage", new_labels);
    },
    doBasicSearch(context, payload) {

      console.log("store action: doBasicSearch() = > received payload {");
      console.log(payload);
      context.commit("resetCurrentRequest");

      context.commit("updateCurrentRequestQuery", payload.query)
      context.commit("updateCurrentRequestAggs", payload.aggs)
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
    queryLoadResult: function(context){
      // submit text to elatsicsearch
      // console.log(this.current_request);
      console.log("Submitting search  -------------------->>");

      console.log(context.state.current_request);
      // var me = this; /* important , callback functino cannot access to this variable*/
      esclient.search({
        index: context.state.current_request.index,
        body: {
          from: context.state.current_request.from, 
          size: context.state.current_request.size,
          _source: context.state.current_request.source,
          query: context.state.current_request.query,
          highlight: context.state.current_request.highlight,
          sort: context.state.current_request.sort,
          aggs: context.state.current_request.aggs
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
    }
  }
})