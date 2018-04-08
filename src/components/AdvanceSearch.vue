<template>
  <div class="advanced-search-container">
    <!--<img src="../assets/logo.jpg">-->    
    <b-col md="8">
        <b-form @submit="onSubmit" @reset="onReset">
        <b-form-input id="input_text" class="el_form_input" v-model="request.text" 
                        autocomplete="off" placeholder="Enter some words" size="lg" required />
        <b-button type="submit" class="el_form_input" variant="primary" size="lg">Submit</b-button>
        <b-button type="reset" class="el_form_input" variant="danger" size="lg">Reset</b-button>
        <transition name="fade">
            <p id="result_container" v-if="result_show" transition>Result Area</p>
        </transition>
        </b-form>
    </b-col>
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
      },
      show: true,
      result_show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.request.text));
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.request.text = "";
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
