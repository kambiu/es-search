<template>
  <div class="search-container">
    <!--<img src="../assets/logo.jpg">-->
    <b-container>
      <b-row align-h="center" align-v="center" class="el_form_input">
        <b-col md="8">
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-input id="input_text" class="el_form_input" v-model="text" 
                          autocomplete="off" placeholder="Enter some words" size="lg" required />
            <b-button type="submit" class="el_form_input" variant="primary" size="lg">Submit</b-button>
            <b-button type="reset" class="el_form_input" variant="danger" size="lg">Reset</b-button>
            <transition name="fade">
              <p id="result_container" v-if="result_show" v-transition>Result Area</p>
            </transition>
          </b-form>
        </b-col>
      </b-row>
      <ResultContainer />
    </b-container>
  </div>
</template>

<script>
import ResultContainer from './ResultContainer.vue'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer
  },
  props: {
    msg: String
  },
  data() {
    return {
      request: {
        text: "",
        opt: ""
      },
      show: true,
      result_show: true
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
      this.text = "";
      /* Trick to reset/clear native browser form validation state */
      this.show = !this.show;
      this.$nextTick(() => { this.show = true });
      this.result_show = !this.result_show;
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

#result_container {
  width: 500px;
  height: 200px;
  background-color: yellow;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
