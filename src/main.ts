// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import {config} from "./nnt/Config"
import {SampleLogin} from "./app/framework-nntlogic-apis";

Vue.config.productionTip = false
Vue.use(Vuex)

config.host(/localhost/, {
  LOCAL: true,
  DEBUG: true,
  DEVELOP: true,
  HOST: "http://localhost:8090/"
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

declare let sdks: any
if (sdks) {
  sdks.config.set('CHANNEL_ID', 1804)
  sdks.config.set('GAME_ID', 100)
  sdks.init().then(() => {
    console.info("SDKS 初始化成功")
    // 使用sdk的用户登录
    sdks.userDetailInfo().then(info => {
      let lg = SampleLogin();
    });
  });
}
