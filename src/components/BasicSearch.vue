<template>
  <div class="basic-search-container">    
    <b-row>
      <b-input-group size="lg">
        <b-form-input id="input_text" class="el_form_input" v-model="request.text" 
            autocomplete="off" placeholder="Enter some words" size="lg" required />
        <b-input-group-append>

          <b-btn v-on:click="onSubmit" class="transparent">
            <img src="../assets/images/search.png" alt="search" height="32" width="32" />
          </b-btn>

        </b-input-group-append>
      </b-input-group>
    </b-row>

    <b-row id="trending_search">
      Trending Now:
      <a class="trend" href="#" v-for="item in trends" :key="item" v-on:click="onSubmit(item)" >{{ item }}</a>
      <!--
      <b-col md="2">Trending Now:
      </b-col>    
      <b-col md="1" v-for="item in trends" :key="item">
        <a href="#">{{item}}</a>
      </b-col>        
      -->
    </b-row>

    <!-- 
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">Trending Now</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="#" v-for="item in trends" :key="item">{{item}}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>   
    --> 

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
    onSubmit: function(submit_text) {
      if (typeof submit_text === 'string' || submit_text instanceof String){
        this.request.text=submit_text;
      }
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
.trend{
  margin-left: 20px;
}

#trending_search {
  margin-top: 10px;
  margin-left: 0px;
}

</style>
