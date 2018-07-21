<template>
  <div class="basic-search-container">
    <!-- basic search input box  -->
    <el-row :gutter="20">
      <el-input size="large" :class="class_text" :placeholder="labels.common.hints"
                v-model="request.text" @keyup.enter.native="onSubmit"
                style="border-color: red">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="onSubmit"></i>
      </el-input>
    </el-row>

    <!-- Trends & advanced button -->
    <!-- sm -->
    <el-row :gutter="80" class="hidden-sm-and-up">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ labels.basic.trend }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onAdvacnedOption()"> {{ labels.basic.more_option }}</el-button>
        </div>
        <a v-for="item in trends" :key="item" class="trend" href="#" v-on:click="onSubmit(item)" >{{ item }}</a>
      </el-card>
    </el-row>
    <!-- xs -->
    <el-row class="hidden-xs-only">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ labels.basic.trend }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onAdvacnedOption()"> {{ labels.basic.more_option }}</el-button>
        </div>
        <a v-for="item in trends" :key="item" class="trend" href="#" v-on:click="onSubmit(item)" >{{ item }}</a>
      </el-card>
    </el-row>

    <!-- alert  -->
    <el-row :gutter="20">
      <el-alert :class="class_alert" :title="err_message" type="error" center show-icon></el-alert>
    </el-row>

  
  </div>
 
</template>

<script>
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
    debug: function() {
      console.log("Debug message ...");
    },
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
  margin-right: 30px;
}

#search_options {
  margin-top: 10px;
  margin-left: 0px;
}

#opt_adv_search_sm {
  text-align: right;
}

a {
  margin-top: 10px;
}

</style>
