<template>
  <div class="advanced-search-container">
    <b-row>
      <b-alert show variant="danger" :class="class_alert" style="width: 100%; margin:10px;" dismissible>
        <span v-html="err_message" />
      </b-alert>
    </b-row>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row id="adv_search_param">
        <b-col md="8">
          <b-row align-h="start" class="form-control-btn">
            <b-col>        
              <b-button type="submit" variant="success">Submit</b-button>
              &nbsp;
              <b-button type="reset">Reset</b-button>
            </b-col>
          </b-row>

          <b-form-group horizontal
                  label="Any of these words:" label-class="text-md" label-for="input_text_or">
            <b-form-input id="input_text_or" :class="class_texts" autocomplete="off"
                v-model="request.text_or" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal
                  label="All of these words:" label-class="text-md" label-for="input_text_and">
            <b-form-input id="input_text_and" :class="class_texts" autocomplete="off"
                v-model="request.text_and" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal label="Exact phrase:" label-class="text-md" label-for="input_text_exact">
            <b-form-input id="input_text_exact" :class="class_texts" autocomplete="off" 
                v-model="request.text_exact" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal
                  label="None of these words:" label-class="text-md" label-for="input_text_not">
            <b-form-input id="input_text_not" autocomplete="off" 
                  v-model="request.text_not"  placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal label="Date:" label-class="text-md" label-for="input_date">
            <b-row id="input_date">
              <b-col md="1">
                <span>From:</span>
              </b-col>
              <b-col md="5">
                <b-form-input id="input_date_from" class="el_form_input" autocomplete="off" type="date" size="md"
                    v-model="request.date.from"  />
              </b-col>
              <b-col md="1">
                <span>To:</span>
              </b-col>
              <b-col md="5">
                <b-form-input id="input_date_to" class="el_form_input" autocomplete="off" type="date" size="md"
                    v-model="request.date.to"  />
              </b-col>
            </b-row>             
          </b-form-group>

          <b-form-group horizontal label="Results per page:" label-class="text-md-left" label-for="num_results">
              <b-form-select id="num_results" v-model="request.max_results" :options="[10,20,50]"  />
          </b-form-group>

          <b-form-group horizontal label="File type:" label-class="text-md-left">
              <b-form-select v-model="request.file_type" :options="file_type_options"  />
          </b-form-group>

          <b-form-group horizontal label="File size:" label-class="text-md-left">
                <b-input-group :prepend="request.file_size.gt_text" class="file_size_grp_magrin">
                  <b-form-input autocomplete="off" v-model="request.file_size.greater_than"></b-form-input>
                  <b-input-group-append>
                    <b-btn id="gt_kb" variant="outline-success" v-on:click="change_file_size">KB</b-btn>
                    <b-btn id="gt_mb" variant="outline-info" v-on:click="change_file_size">MB</b-btn>
                  </b-input-group-append>
                </b-input-group>

                <b-input-group :prepend="request.file_size.lt_text" class="file_size_grp_magrin">
                  <b-form-input autocomplete="off" v-model="request.file_size.less_than"></b-form-input>
                  <b-input-group-append>
                    <b-btn id="lt_kb" variant="outline-success" v-on:click="change_file_size">KB</b-btn>
                    <b-btn id="lt_mb" variant="outline-info" v-on:click="change_file_size">MB</b-btn>
                  </b-input-group-append>
                </b-input-group>
          </b-form-group>

          <b-form-group horizontal label="Search scope:" label-class="text-md-left">
              <b-form-radio-group buttons v-model="request.scope" class="pt-2" :options="scope_options" />
          </b-form-group>

          
          <!--
          <b-row align-h="start">
            <b-col>        
              <b-button type="submit" variant="success">Submit</b-button>
              &nbsp;
              <b-button type="reset">Reset</b-button>
            </b-col>
          </b-row>
          -->

        </b-col>  
      </b-row>

    </b-form>  
    
  </div>
</template>

<script>
import ns from '../utils/NameSpace.js'

export default {
  name: 'AdvanceSearch',
  props: {
    msg: String
  },
  data() {
    return {
      file_type_options: [
        { text: 'All file types', value: 'all' },
        { text: 'Text (.txt)', value: 'txt' },
        { text: 'PDF (.pdf)', value: 'pdf' },
        { text: 'Microsoft Office Document (.docx/.pptx/.xlsx ...)', value: 'ms' },
        { text: 'Images (.png/.jpg ...)', value: 'img' },
        { text: 'Video (.mp4/.mov ...)', value: 'vid' }
      ],
      scope_options: [
        { text: 'All', value: 'all' },
        { text: 'Content Only', value: 'content' },
        { text: 'Metadata Only', value: 'meta' }
      ],
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
          lt_text: "Less than (KB)"
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
    class_texts: function() {
      return {
        hasError: this.err_fields.texts
      }      
    },
    class_alert: function() {
      return {
        hidden: this.err_message == 0
      }      
    },
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      console.log( this.request)
      // if (this.request)
      //   return;
      // this.$emit("action", this.request);
      // var isValid = this.advancedSearchValidation();
      if (this.advancedSearchValidation())
        this.$emit("action", {action: ns.advancedAction.search, query: this.request});
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
    change_file_size: function (evt){
      if (evt.target.id == "gt_kb"){
        this.request.file_size.gt_text = this.request.file_size.gt_text.replace("MB", "KB")
      }
      else if (evt.target.id == "gt_mb"){
        this.request.file_size.gt_text = this.request.file_size.gt_text.replace("KB", "MB")
      }
      else if (evt.target.id == "lt_kb"){
        this.request.file_size.lt_text = this.request.file_size.lt_text.replace("MB", "KB")
      }
      else if (evt.target.id == "lt_mb"){
        this.request.file_size.lt_text = this.request.file_size.lt_text.replace("KB", "MB")
      }
      
    },
    advancedSearchValidation: function() {
      // check textbox
      if ( (this.request.text_or && this.request.text_or.trim().length > 0)
        || (this.request.text_and && this.request.text_and.trim().length > 0)
        || (this.request.text_exact && this.request.text_exact.trim().length > 0) ) {

        // reset error message
        this.err_message = ""
        this.err_fields.texts = false;
        console.log("advancedSearchValidation return true");
        return true;
      }
      console.log("advancedSearchValidation return false");
      // highlight textbox
      this.err_message = "Please enter some texts."
      this.err_fields.texts = true;
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.advanced-search-container {
  margin: 20px;
}

#adv_search_param {
  margin-top: 50px;
}

.input_controls {
  margin-top: 10px;
}

.form-control-btn{
  margin-top: 20px;
  margin-bottom: 20px;
}

.file_size_grp_magrin{
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
