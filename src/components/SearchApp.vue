<template>
  <div class="search-container">
    <button v-on:click="debug" hidden>Debug</button>
    <b-container fluid>
      <b-row align-h="center">
        <b-col md="4">
          <b-form-group horizontal
                  :label="labels.common.language" label-class="text-sm" label-for="display_language">
            <b-form-select id="display_language" v-model="lang" :options="option_lang" @input="changeLanguage()"></b-form-select>
          </b-form-group>       

        </b-col>
      </b-row>
      <b-row align-h="center" align-v="center" class="search_input">
        <b-col md="10">
          <AdvanceSearch v-if="layout.show_advanced_search_page" @action="advancedAction($event)" />
          <BasicSearch v-if="layout.show_basic_search_page" />          
        </b-col>
      </b-row>
      <transition name="fade">
        <b-row align-h="center" align-v="center" class="search_result" v-if="layout.show_result_page">
          <b-col md="10">
            <ResultContainer  />
          </b-col>
        </b-row>
      </transition>
    </b-container>
  </div>
</template>

<script>
import ResultContainer from './ResultContainer.vue'
import AdvanceSearch from './AdvanceSearch.vue'
import BasicSearch from './BasicSearch.vue'
import appcfg from '../config.js'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch,
    BasicSearch
  },
  created() {
    console.log("-----created-----");
    // for (let lang of appcfg.languages) {
    //    console.log(lang);
    // }
    //TODO load from cookies and set language
    var cookie_lang = this.$cookies.get("user_language");
    console.log("lang from cookies: " + cookie_lang);
    if (cookie_lang){
      console.log("Set lang to " + cookie_lang);
      this.$store.dispatch("changeLanguage", cookie_lang);
      this.lang = cookie_lang;
    } else{
      console.log("Set lang to en-us");
      this.$store.dispatch("changeLanguage", "en-us");
      this.lang = "en-us";
    }
    console.log("this.show_basic_search_page: " + this.layout.show_basic_search_page);
    console.log("this.show_advanced_search_page: " + this.layout.show_advanced_search_page);
    console.log("this.show_result_page: " + this.layout.show_result_page);
  },
  data() {
    return {
      lang: "en-us",
      list_search_history: [
        "Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"
      ]
    }
  },
  computed: {
    option_lang: function() {
      var ret_arr = []
      for (let lang of appcfg.languages) {
        ret_arr.push({
          "value": lang,
          "text": lang
        });
      }
      return ret_arr;
    },
    labels() {
      return this.$store.state.labels;
    },
    layout() {
      return this.$store.state.layout;
    }
  },
  methods: {
    debug() {
      console.log("----------- debug message -----------");
      console.log(this.labels);
    },
    changeLanguage: function() {
      console.log("Change to " + this.lang);
      
      console.log("Save to cookie user_language" + this.lang);
      this.$cookies.set("user_language", this.lang, 60 * 60 * 24 * 180); //180 days

      this.$store.dispatch("changeLanguage", this.lang);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

strong, em{
  color: #dd4b39 !important;
  font-weight: bold;  
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.transparent {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0.2);
}

.hidden {
  display: none;
}

.hasError {
  border-color: red;
  border-width: 2px;
}
</style>
