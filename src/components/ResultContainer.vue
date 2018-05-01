<template>
  <div>
    <b-row>
      <b-col sm="8" class="my-0">
        <ResponseInfo :time="response_time" :hits="response_hits" />
        <ResultNormal v-for="item in allresults" :result="item" :key="item.title" />
      </b-col>
      <b-col sm="3" class="my-0">
        <div>Search History:</div>
        <div>
          <b-list-group class="listGrp">
            <b-list-group-item v-for="(item, index) in searchHistory" :key="index" v-on:click="submitSearch(item)"
            class="listSearchHistory" href="#">{{item}}</b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
    </b-row>
    <b-row align-h="center" id="pageNavigation">
      <!--<b-pagination-nav :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" />-->
      <b-pagination-nav base-url="#" :limit="8" :number-of-pages="10" v-model="currentPage" v-on:click="linkGen" 
      first-text="First" prev-text="Previous" next-text="Next" last-text="Last"/>
    </b-row>
    


  </div>
</template>

<script>

import ResultNormal from './ResultNormal.vue'
import ResponseInfo from './ResponseInfo.vue'

export default {
  name: 'ResultContainer',
  data() {
    return {
      // the following will be in props later
      currentPage: 1,
      response_time: "0.01",
      response_hits: "5",      
      allresults : [
        {
          title: "Android One Moto X4",
          link: "https://www.android.com/phones/moto-x4/",
          date: "1522989114",
          summary: "Tap into the best of <strong>Android</strong> on the Android One Moto X4, pairing premier hardware with a best-in-class Google experience",
        },
        {
          title: "Google Services | Android Developers",
          link: "https://developer.android.com/google/index.html",
          date: "1522989114",
          summary: "Improving app security and performance on Google Play for years to come. [ Edit : Updated post on Dec 21 to clarify that when the 64-bit requirement is introduced in August 2019, 32-bit support is not going away. Apps that include a 32-bit library just need to have a 64-bit version too.] Google Play powers billions of app.",
        },
        {
          title: "Android Developers",
          link: "https://developer.android.com/index.html",
          date: "1522989114",
          summary: "LinkedIn uses <strong>Android</strong> Studio to build a performant app. Watch how the LinkedIn mobile team uses Android Studio to build their Android app, and stay focused on topics which affect performance and are vital for the quality of the app. Watch the video. Google Play ...",
        },
        {
          title: "Google is launching an Android chat service to replace SMS",
          link: "https://www.washingtonpost.com/news/the-switch/wp/2018/04/20/google-is-launching-an-android-chat-service-to-replace-sms/?noredirect=on",
          date: "1522989114",
          summary: "<strong>Google</strong> is rolling out a new chat service to replace standard texting, a move that analysts say will offer Android users advanced features already found in popular chat services such as Apple's iMessage and Facebook's WhatsApp. But the unveiling also represents a strategic retreat for the tech giant, experts ...",
        },
        {
          title: "Google Maps Android API | Google Developers",
          link: "https://developers.google.com/maps/documentation/android-api/",
          date: "1522989114",
          summary: "Add a map to your Android app and use the API to add markers, polygons, and overlays; change the user's view; or allow user interaction.",
        }
      ]
    }
  },
  props: [
    "searchHistory"
  ],    
  components: {
    ResultNormal,
    ResponseInfo
  },
  methods: {
    hoverList: function(evt) {
      if (!evt) {
        evt = window.event; 
      }
      
      var el = (event.target || event.srcElement);
      el.setAttribute('active', "");
    },

    linkGen: function (evt) {
      console.log("Current page: " + this.currentPage);
      console.log(evt);
      //console.log("this is page: " + pageNum);
    },
    submitSearch: function(text_history) {

      this.$emit("eSearchAction", {text: text_history});
    }
  }
}


</script>

<style scoped>

.listSearchHistory:hover {
  background-color: #007bff;
  color: white;
}

#pageNavigation {
  margin-top: 20px;
}
</style>
