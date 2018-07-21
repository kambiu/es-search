<template>
  <div class="search-container">
    <button v-on:click="debug" hidden>Debug</button>
    <el-container>

      <el-header>
        <!-- sm -->
        <el-row type="flex" :gutter="20" justify="end" class="hidden-xs-only">
          <Language />
        </el-row>
        <!-- xs -->
        <el-row type="flex" :gutter="20" justify="center" class="hidden-sm-and-up">
          <Language />
        </el-row>
      </el-header>
       
      <el-main>
        <el-row type="flex" justify="center">
          <el-col>
            <AdvanceSearch v-if="layout.show_advanced_search_page" @action="advancedAction($event)" />
            <BasicSearch v-if="layout.show_basic_search_page" />
            <el-collapse-transition>
              <div v-if="layout.show_result_page">
                <ResultContainer  />
              </div>
            </el-collapse-transition>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
import ResultContainer from './ResultContainer.vue'
import AdvanceSearch from './AdvanceSearch.vue'
import BasicSearch from './BasicSearch.vue'
import Language from './Language.vue'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch,
    BasicSearch,
    Language
  },
  created() {
    console.log("-----created-----");
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
    labels() {
      return this.$store.state.labels;
    },
    layout() {
      return this.$store.state.layout;
    },
    trends() {
      return this.$store.state.trends;
    },
  },
  methods: {
    debug() {
      console.log("----------- debug message -----------");
      console.log(this.labels);
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

.el-row {
  margin-top: 20px;
}



/* global defautl font-family */

div, span, p {
  font-family: arial,sans-serif;
}

</style>
