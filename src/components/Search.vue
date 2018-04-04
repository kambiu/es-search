<template>
  <div class="search-container">
    <!--<img src="../assets/logo.jpg">-->
    <b-container>
      <b-row align-h="center" align-v="center" class="el_form_input">
        <b-col md="8">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-input id="input_text" class="el_form_input" v-model="text" 
                          autocomplete="off" placeholder="Enter some words" size="lg" required />
            <b-button type="submit" class="el_form_input" variant="primary" size="lg">Submit</b-button>
            <b-button type="reset" class="el_form_input" variant="danger" size="lg">Reset</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    msg: String
  },
  data() {
    return {
      request: {
        text: "",
        opt: ""
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.text));
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.text = ""
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el_form_input {
  margin: 5px;
  text-align:center;
}
</style>
