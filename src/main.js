import Vue from 'vue'
import App from './App.vue'

//vuex
import {store} from './store/store'

// vue-cookies
import VueCookies from 'vue-cookies'

// bootstrap
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueCookies);
Vue.use(ElementUI);
// Vue.use(BootstrapVue);

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  store: store
}).$mount('#app')
