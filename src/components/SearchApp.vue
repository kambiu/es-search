<template>
  <div class="search-container">
    <b-container>
      <b-row align-h="center" align-v="center" class="search_input">
        <AdvanceSearch />
      </b-row>
      <b-row align-h="center" align-v="center" class="search_result">
        <ResultContainer />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ResultContainer from './ResultContainer.vue'
import AdvanceSearch from './AdvanceSearch.vue'

export default {
  name: 'SearchApp',
  components: {
    ResultContainer,
    AdvanceSearch
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

strong {
  color: #dd4b39 !important;
  font-weight: bold;  
}

</style>
