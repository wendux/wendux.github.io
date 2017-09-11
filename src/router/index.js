import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import MarkdownPage from '../components/MarkdownPage.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/doc/:path/:name',
      name: 'doc',
      component: MarkdownPage
    }
  ]
})
