import Router from 'vue-router'

const Sample = () => import("../components/Sample.vue")

const routes = [
  {
    path: '/',
    component: Sample
  }
];

export default new Router({
  routes: routes
})
