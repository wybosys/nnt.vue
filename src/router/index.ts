import Vue from 'vue'
import Router from 'vue-router'

const Sample = () => import("../components/Sample.vue")

export default new Router({
  routes: [
    {
      path: '/',
      component: Sample
    }
  ]
})
