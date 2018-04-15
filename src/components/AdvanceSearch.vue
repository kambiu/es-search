<template>
  <div class="advanced-search-container">    
    <b-form @submit="onSubmit">
      <b-row>
        <b-col md="11">
          <b-form-input 
            id="input_text" class="el_form_input" v-model="request.text" 
            autocomplete="off" placeholder="Enter some words" size="lg" required />
        </b-col>
        <b-col md="1">
          <b-button type="submit" class="el_form_input" variant="primary" size="lg">Submit</b-button>
          <!--<b-button type="reset" class="el_form_input" variant="danger" size="lg">Reset</b-button>-->
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
        text: ""
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      console.log(JSON.stringify(this.request.text));
      this.$emit("showResultPanel", "submit button is clicked");      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
