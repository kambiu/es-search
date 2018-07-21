<template>
  <div class="advanced-search-container">

    <el-button @click="debug()" class="hidden">Debug</el-button>
    <!-- alert -->
    <el-row id="grp_alert_message">
      <el-alert :title="err_message" type="error" v-if="err_message.length > 0"></el-alert>
    </el-row>

    <!-- form -->
    <el-row id="grp_form">
      <el-form ref="form" :model="request" label-width="150px" :label-position="label_position">

        <!-- boolean operator text input -->
        <el-form-item :label="labels.advanced.text_or">
          <el-input v-model="request.text_or" :placeholder="labels.common.hints"></el-input>
        </el-form-item>
        <el-form-item :label="labels.advanced.text_and">
          <el-input v-model="request.text_and" :placeholder="labels.common.hints"></el-input>
        </el-form-item>
        <el-form-item :label="labels.advanced.text_exact">
          <el-input v-model="request.text_exact" :placeholder="labels.common.hints"></el-input>
        </el-form-item>
        <el-form-item :label="labels.advanced.text_not">
          <el-input v-model="request.text_not" :placeholder="labels.common.hints"></el-input>
        </el-form-item>

        <!-- date -->
        <el-form-item :label="labels.advanced.date.label" >
          <el-row>
            <el-col :span="11" >
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="Pick a date" v-model="request.date.from" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-date-picker type="date" placeholder="Pick a date" v-model="request.date.to"  style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- result per page -->
        <el-form-item :label="labels.advanced.result_per_page">
          <el-select v-model="request.max_results" placeholder="please select your zone" style="width: 100%">
            <el-option label="10" value="10"></el-option>
            <el-option label="20" value="20"></el-option>
            <el-option label="50" value="50"></el-option>
          </el-select>
        </el-form-item>

         <!-- file type -->
        <el-form-item :label="labels.advanced.file_type.label">
          <el-select v-model="request.file_type" placeholder="Please select a file format" style="width: 100%" disabled>
            <el-option 
              v-for="item in file_type_options"
              :key="item.value"
              :label="item.text"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- file size -->
        <el-form-item :label="labels.advanced.file_size.label">
          <el-input placeholder="" v-model="request.file_size.greater_than" disabled>
            <template slot="prepend">{{labels.advanced.file_size.greater_than}}</template>
            <template slot="append">
             <el-select v-model="request.file_size.gt_category" style="width: 80px">
              <el-option label="KB" value="KB"></el-option>
              <el-option label="MB" value="MB"></el-option>
             </el-select>
            </template>

          </el-input>
          <el-input placeholder="" v-model="request.file_size.less_than" disabled>
            <template slot="prepend">{{labels.advanced.file_size.less_than}}</template>
            <template slot="append">
              <el-select v-model="request.file_size.gt_category" style="width: 80px">
              <el-option label="KB" value="KB"></el-option>
              <el-option label="MB" value="MB"></el-option>
             </el-select>
            </template>
          </el-input>
        </el-form-item>

        <!-- search scope -->
        <el-form-item :label="labels.advanced.scope.label">
          <el-radio-group v-model="request.scope" disabled>
            <el-radio-button 
              v-for="item in scope_options"
              :label="item.text"
              :key="item.value"
              :value="item.value">
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- submit and reset form -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ labels.advanced.submit }}</el-button>
          <el-button @click="onReset">{{ labels.advanced.reset }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

  </div>
</template>

<script>
import SearchUtils from '../utils/SearchUtils' 

export default {
  name: 'AdvanceSearch',
  props: {
    msg: String
  },
  data() {
    return {
      request: {
        // text
        text_or: null,
        text_and: null,
        text_not: null,
        text_exact: null,
        // date
        scope: "all",
        date: {
          from: null,
          to: null
        },  
        max_results: 10,      
        // file metadata
        file_type: "all",
        file_size: {
          greater_than: null,
          less_than: null,
          gt_text: "Greater than (KB)",
          lt_text: "Less than (KB)",
          gt_category: "KB",
          lt_category: "KB"
        },
        // other filters
        repository: ["cake", "staff", "student"]
      },
      err_fields: {
        texts: false
      },
      err_message: ""
    }
  },
  computed: {
    labels() {
      return this.$store.state.labels;
    },
    label_position(){
      if (screen.width > 765)
        return "right"
      else
        return "top"
    },
    file_type_options() {
      return [
        { text: this.labels.advanced.file_type.all, value: 'all' },
        { text: this.labels.advanced.file_type.txt, value: 'txt' },
        { text: this.labels.advanced.file_type.pdf, value: 'pdf' },
        { text: this.labels.advanced.file_type.ms, value: 'ms' },
        { text: this.labels.advanced.file_type.img, value: 'img' }
      ]
    },
    scope_options(){
      return [
        { text: this.labels.advanced.scope.all, value: 'all' },
        { text: this.labels.advanced.scope.content, value: 'content' },
        { text: this.labels.advanced.scope.meta, value: 'meta' }
      ]
    }
  },
  methods: {
    debug: function() {
      console.log("[AdvacnedSearch-Debug] " + screen.width)
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.advancedSearchValidation()) {
        var payload = {};
        payload.query = SearchUtils.getAdvancedSearchQuery(this.request);
        payload.aggs = SearchUtils.getAggregations(this.request);
        payload.index = "*";
        payload.size = this.request.max_results;
            
        this.$store.dispatch("doAdvancedSearch", payload);
      
        // this.$emit("action", {action: ns.advancedAction.search, query: this.request});
      }
    },
    onReset(evt){
        evt.preventDefault();
        this.request.text_or = null;
        this.request.text_and = null;
        this.request.text_not = null;
        this.request.text_exact = null;
        this.request.scope = "All";
        this.request.date.from = null;
        this.request.date.to = null;
        this.request.max_results = 10;
        this.request.file_type = "all";
        this.request.file_size.greater_than = null;
        this.request.file_size.less_than = null;
        this.request.repository = []
    },
    onAdvacnedOption: function() {
      // functino wihtout usage ?? TODO
      // this.$emit("action", "adv");
      // this.$emit("action", {action: ns.advancedAction.search});
    },
    advancedSearchValidation: function() {
      // check textbox
      if ( (this.request.text_or && this.request.text_or.trim().length > 0)
        || (this.request.text_and && this.request.text_and.trim().length > 0)
        || (this.request.text_exact && this.request.text_exact.trim().length > 0) ) {

        // reset error message
        this.err_message = ""
        this.err_fields.texts = false;
        console.log("advancedSearchValidation passed");
        return true;
      }
      console.log("advancedSearchValidation return false");
      // highlight textbox
      this.err_message = "Please enter some texts."
      this.err_fields.texts = true;
      console.log("advancedSearchValidation failed");
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#grp_form, #grp_alert_message {
  margin-top: 20px;
}

</style>
