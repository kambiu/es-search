<template>
  <div class="advanced-search-container">    
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row id="adv_search_param">
        <b-col md="8">
          <b-row align-h="start">
            <b-col>        
              <b-button type="submit" variant="success">Submit</b-button>
              &nbsp;
              <b-button type="reset">Reset</b-button>
            </b-col>
          </b-row>

          <b-form-group horizontal
                  label="Any of these words:" label-class="text-md" label-for="input_text_or">
            <b-form-input id="input_text_or" class="el_form_input" autocomplete="off"
                v-model="request.text_or" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal
                  label="All of these words:" label-class="text-md" label-for="input_text_and">
            <b-form-input id="input_text_and" class="el_form_input" autocomplete="off"
                v-model="request.text_and" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal
                  label="None of these words:" label-class="text-md" label-for="input_text_not">
            <b-form-input id="input_text_not" class="el_form_input" autocomplete="off" 
                  v-model="request.text_not"  placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal label="Exact phrase:" label-class="text-md" label-for="input_text_exact">
            <b-form-input id="input_text_exact" class="el_form_input" autocomplete="off" 
                v-model="request.text_exact" placeholder="Enter some words" size="md" />
          </b-form-group>

          <b-form-group horizontal label="Date:" label-class="text-md" label-for="input_date">
            <b-form-input id="input_date" class="el_form_input" autocomplete="off" type="date" size="md"
                v-model="request.date"  />
          </b-form-group>

          <b-form-group horizontal
                  label="Search scope:"
                  label-class="text-md-left">
              <b-form-radio-group class="pt-2" :options="['All', 'Content', 'Metadata']" />
          </b-form-group>

          <b-form-group horizontal
                  label="Results per page:"
                  label-class="text-md-left">
              <b-form-select v-model="request.max_results" :options="[10,20,50]"  />
          </b-form-group>

          <b-row align-h="start">
            <b-col>        
              <b-button type="submit" variant="success">Submit</b-button>
              &nbsp;
              <b-button type="reset">Reset</b-button>
            </b-col>
          </b-row>



        </b-col>  
      </b-row>

    </b-form>  
    
  </div>
</template>

<script>

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
        scope: null,
        date: null,  
        max_results: 10,      
        // file metadata
        file_type: null,
        file_size: null,
        // other filters
        repository: []
      },
      trends: [
        "111", "222", "333"
      ]
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$emit("eSearchAction", this.request);      
    },
    onReset(evt){
        evt.preventDefault();
        console.log("reset");
        this.request.text_or = "";
        this.request.text_and = "";
        this.request.text_not = "";
        this.request.text_exact = "";
        this.request.scope = "All";
        this.request.date = null;
        this.request.max_results = 10;
        this.request.file_type = "";
        this.request.file_size = "";
        this.request.repository = []
    },
    onAdvacnedOption: function() {
      this.$emit("eSearchAction", "adv");      
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

.class="cbtn" {
  margin-right: 10px;
}
</style>
