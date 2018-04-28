<template>
  <div class="basic-search-container">    
    <b-form @submit="onSubmit">
      <b-row>
        <b-col md="9">
          <b-form-input 
            id="input_text" class="el_form_input" v-model="request.text" 
            autocomplete="off" placeholder="Enter some words" size="lg" required />
        </b-col>
        <b-col md="3">
          <b-row>
            <b-col md="6">
              <b-button type="submit" class="el_form_input" variant="primary" size="lg">Submit</b-button> 
            </b-col>
            <b-col md="6">
              <a href="#" v-on:click="onAdvacnedOption()">Advanced Options</a>
            </b-col>
          </b-row>
        </b-col>  
      </b-row>
      <b-row id="trending_search">
        <b-col md="2">Trending Now:
        </b-col>    
        <b-col md="1" v-for="item in trends" :key="item">
          <a href="#">{{item}}</a>
        </b-col>        
      </b-row>
    </b-form>  
    
  </div>
</template>

<script>

export default {
  name: 'BasicSearch',
  props: {
    msg: String
  },
  data() {
    return {
      request: {
        // text
        text: ""
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
    onAdvacnedOption: function() {
      this.$emit("eSearchAction", "adv");      
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

</style>
