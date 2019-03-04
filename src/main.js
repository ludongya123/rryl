// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import './assets/css/reset.css';
import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'
import anime from 'animejs'
Vue.prototype.$animate = anime
// import './assets/css/base.scss';
Vue.use(MintUi)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
