// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import App from './App'
import router from './router'
var Fly=require("flyio/dist/npm/fly")
Vue.use(Vuetify)
Vue.config.productionTip = false
Object.assign(window,{
  log:console.log.bind(console),
  fly:new Fly,
  Fly,
  bus:new Vue(),
  store:{
    title:"",
    menus:{},
    map:{}
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

console.log("%c***********************\n" +
  "本站使用fly作为网络请求库\n" +
  "github: https://github.com/wendux/fly\n" +
  "author: wendu, 欢迎 star! \n"+
  "***********************",'color: teal')
console.log("您可以直接输入fly验证其功能")
