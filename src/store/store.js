import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    labels: 0,
  },
  mutations: {
    changeLanguage (state, new_labels) {
      state.labels = new_labels;
    }
  },
  actions: {
    changeLanguage(context, payload) {
      var new_labels = require("../assets/language/" + payload + ".json");
      context.commit("changeLanguage", new_labels);
    }
  }
})