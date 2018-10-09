// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueConfigManager from 'vue-config-manager'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueConfigManager, {
  defaults: {
    LOCAL: false,
    DEVOPS: false,
    DEVOPS_DEVELOP: false,
    DEVOPS_RELEASE: false,
    DEBUG: false,
    DEVELOP: false,
    PUBLISH: false,
    DISTRIBUTION: false
  },
  hosts: {
    'localhost': {
      LOCAL: true,
      DEBUG: true,
      DEVELOP: true
    },
    '91egame.com': {
      DEVOPS: true,
      DEVOPS_DEVELOP: true,
      PUBLISH: true,
      DISTRIBUTION: true
    },
    '91yigame.com': {
      DEVOPS: true,
      DEVOPS_RELEASE: true,
      PUBLISH: true,
      DISTRIBUTION: true
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
