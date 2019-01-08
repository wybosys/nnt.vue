import App from './App.vue'
import router from './router'
import {SampleLoginsdk, SampleLoginverifysdk} from "./app/framework-nntlogic-apis";
import {Get} from "./nnt/RestSession";
import {Application} from "./nnt/Application";

new Application({
  app: App,
  router: router
}).start()

declare let sdks: any
if (sdks) {
  sdks.config.set('CHANNEL_ID', 1804)
  sdks.config.set('GAME_ID', 100)
  sdks.init().then(() => {
    console.info("SDKS 初始化成功")
    // 使用sdk的用户登录
    sdks.userDetailInfo().then(info => {
      let lg = SampleLoginsdk();
      lg.raw = info.raw;
      lg.channel = info.channel;
      Get(lg).then(() => {
        let lv = SampleLoginverifysdk();
        lv.sid = lg.sid;
        Get(lv).then(() => {
          console.log("登录成功 " + lv.user.uid);
        });
      });
    });
  });
}
