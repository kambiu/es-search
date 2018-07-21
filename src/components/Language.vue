<template>
  <div class="language-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item :label="labels.common.language">
        <el-select v-model="lang" @change="changeLanguage()" size="mini">            
          <el-option
            v-for="item in option_lang"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import appcfg from '../config.js'

export default {
  name: 'SearchApp',
  created() {
    console.log("-----Lnaguage created-----");
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
  },
  data() {
    return {
      lang: "en-us"
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

.language-container {
  margin-right: 50px;
  margin-left: 50px;
}
</style>
