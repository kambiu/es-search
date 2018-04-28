<template>
  <div class="search-container">
    <b-container fluid>
      <b-row align-h="center" align-v="center" class="search_input">
        <b-col md="10">
          <AdvanceSearch @eSearchAction="handleSearch($event)" />
          <BasicSearch @eSearchAction="handleSearch($event)" />          
        </b-col>
      </b-row>
      <transition name="fade">
        <b-row align-h="center" align-v="center" class="search_result" v-if="show_result">
          <b-col md="10">
            <ResultContainer :searchHistory="list_search_history" />
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

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch,
    BasicSearch
  },
  data() {
    return {
      show_result: false,
      list_search_history: [
        "Cras justo odio", "Dapibus ac facilisis in", "Morbi leo risus", "Porta ac consectetur ac", "Vestibulum at eros"
      ],
    }
  },
  methods: {
    handleSearch: function(event){
      if (event == "adv") {
        /* call advanced search*/
        this.show_result = false;

      } else {
        /* submit search*/
        this.show_result = true;
        var text = event.text;
        this.list_search_history.unshift(text);    
        this.list_search_history = this.list_search_history.slice(0, 5);
      }    
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

strong {
  color: #dd4b39 !important;
  font-weight: bold;  
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
