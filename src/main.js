// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import App from './App'
import router from './router'
import axios from 'axios'
Vue.use(Vuetify)
Vue.config.productionTip = false

Object.assign(window,{
  log:console.log.bind(console),
  axios,
  bus:new Vue(),
  store:{
    title:"",
    menus:[],
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
