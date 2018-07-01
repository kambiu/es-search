<template>
  <div class="basic-search-container">    
    <b-row>
      <b-input-group size="lg">
        <b-form-input id="input_text" :class="class_text" v-model="request.text" 
            autocomplete="off" :placeholder="labels.common.hints" size="lg" required />
        <b-input-group-append>

          <b-btn v-on:click="onSubmit" class="transparent">
            <img src="../assets/images/search.png" alt="search" height="32" width="32" />
          </b-btn>

        </b-input-group-append>
      </b-input-group>
    </b-row>

    <b-row id="search_options" align-h="between">
      <b-col>
        {{ labels.basic.trend }}
        <a class="trend" href="#" v-for="item in trends" :key="item" v-on:click="onSubmit(item)" >{{ item }}</a>
      </b-col>
      <b-col>
        <div id="opt_adv_search"><a href="#" v-on:click="onAdvacnedOption()">{{ labels.basic.more_option }}</a></div>
      </b-col>
      
    </b-row>
    <b-row>
      <b-alert show variant="danger" :class="class_alert" style="width: 100%; margin:10px;" dismissible>
        <span v-html="err_message" />
      </b-alert>
    </b-row>

    <!-- 
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">Trending Now</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="#" v-for="item in trends" :key="item">{{item}}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>   
    --> 

  </div>
 
</template>

<script>
// import ns from '../utils/NameSpace.js'
//import appcfg from '../config.js'
import SearchUtils from '../utils/SearchUtils'

export default {
  name: 'BasicSearch',
  props: {
    msg: String
  },
  data() {
    return {
      request: {
        text: ""
      },
      err_text: false,
      err_message: ""
    }
  },
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    basic_request() {
      return this.$store.state.baisc_request;
    },
    trends() {
      return this.$store.state.trends;
    },
    class_text: function(){
      return {
        hasError: this.err_text
      }
    },
    class_alert: function() {
      return {
        hidden: this.err_message == 0
      }
    }
  },
  methods: {
    onSubmit: function(submit_text) {
      if (typeof submit_text === 'string' || submit_text instanceof String){
        this.request.text = submit_text;
      }

      var isValid = this.basicSearchValidation();
      if (isValid) {
        console.log("submit_text: " + this.request.text);
        
        var payload = {}
        payload.query = SearchUtils.getBasicSearchQuery(this.request.text);
        payload.aggs = SearchUtils.getAggregations(); 

        this.$store.dispatch("updateSearchHistory", this.request.text);
        this.$store.dispatch("doBasicSearch", payload);
      }        
    },
    onAdvacnedOption: function() {
      this.$store.dispatch("showAdvancedSearchPage");
    },
    basicSearchValidation: function() {

      // check textbox
      if (this.request.text) {
        if (this.request.text.trim().length > 0){
          // reset form error
          
          this.err_text = false;
          this.err_message = "";
          return true;
        }
          
      }
      // highlight textbox
      this.err_text = true;
      this.err_message = this.labels.common.error_empty_field
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.basic-search-container {
  margin: 20px;
}

#adv_search_param {
  margin-top: 50px;
}

.input_text {
  margin-top: 10px;
}
.trend{
  margin-left: 20px;
}

#search_options {
  margin-top: 10px;
  margin-left: 0px;
}

#opt_adv_search {
  text-align: right;
}

</style>
