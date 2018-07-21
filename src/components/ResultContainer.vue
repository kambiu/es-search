<template>
  <div>
    <el-row>
      <!-- left side -->
      <el-col :xs="24" :sm="18">
        <!-- reponseinfo & sorting -->
        <el-row>
          <!-- reponseinfo -->
          <el-col :span="12">
            <ResponseInfo />
          </el-col>
          <!-- sorting -->
          <el-col :span="12" class="hidden-xs-only">
            <span>{{labels.result.sort_by.label}}</span>&nbsp;&nbsp;
            <el-select v-model="result_sort_by" @change="changeSorting(result_sort_by)">
              <el-option
                v-for="item in sortby_options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          
        </el-row>

        <!-- sorting when small screen -->
        <el-row class="hidden-sm-and-up" id="xs_sort">
          <el-col>
            <span>{{labels.result.sort_by.label}}</span>&nbsp;&nbsp;
            <el-select v-model="result_sort_by" @change="changeSorting(result_sort_by)">
              <el-option
                v-for="item in sortby_options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <!-- search results -->
        <el-row>
          <ResultNormal v-for="item in list_result" :result="item" :key="item._id" />
        </el-row>

        <!-- pagination-->
        <el-row>
          <el-pagination
            :current-page.sync="current_page"
            layout="prev, pager, next"
            :total="searchResults.hits.total"
            v-show="searchResults.hits.total != 0"
            @current-change="pageSearch(current_page)">
          </el-pagination>
        </el-row>  
      </el-col>

      <!-- right side filtering -->
      <el-col :span="6" class="hidden-xs-only">
        <ResultRightPanel />
      </el-col>
    </el-row>
    <el-row class="hidden-sm-and-up">
      <ResultRightPanel />
    </el-row>


  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'
import ResponseInfo from './ResponseInfo.vue'
import ResultRightPanel from './ResultRightPanel.vue'

export default {
  name: 'ResultContainer',
  data() {
    return {
      result_sort_by: "_score"
    }
  },
  computed: {
    sortby_options() {
      return [
        { value: "_score", text: this.labels.result.sort_by.score },
        { value: "date_modified", text: this.labels.result.sort_by.date },
      ]
    },
    numPage: function() {
      return Math.ceil(this.result_hits * 1.0 / this.page_size);
    },
    /* vuex */
    labels() {
      return this.$store.state.labels;
    },
    list_result() {
      return this.$store.getters.list_result;
    },
    searchResults() {
      return this.$store.state.es_response;
    },
    result_hits() {
      return this.$store.getters.result_hits;
    },
    page_size() {
      return this.$store.getters.page_size;
    },
    //TODO problem getting updated value from vuex
    current_page: {
      get() {
        return this.$store.getters.current_page;
      },
      set(page) {
        console.log("current_page setter is called " + page);
        this.$store.dispatch("changePage", page);
      }
      
    }
  },
  props: [
    "resultFiltered",
  ],    
  components: {
    ResultNormal,
    ResponseInfo,
    ResultRightPanel
  },
  methods: {
    debug: function(){
      console.log("current_page: " + this.current_page);
      console.log("page_size: " + this.page_size);
    },
    pageSearch: function(page) {
      console.log("pageSearch with page " + page);
      this.$store.dispatch("changePage", page);
    },
    changeSorting: function(sort_method) {
      this.field_current_page = 1;
      this.$store.dispatch("changeSorting", sort_method);
    },
    rightPanelAction: function(event) {
      this.$emit("action", event);
    }
  },
  created(){
    console.log("ResultContainer created ==>");
  }
}

</script>

<style scoped>

.response-info {
  margin-left: 8px;
  margin-top: 3px;
  margin-bottom: 10px;
}

#xs_sort {
   margin-left: 10px;
   margin-right: 10px;
}
</style>
