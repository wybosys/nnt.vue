import {Storage} from './Storage';
import {loadScript, uuid} from "./Compat";
import Vue from 'vue'
import Router from 'vue-router'
import {IndexedObject, IndexedType} from "./Kernel";
import {config} from "./Config";
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(Router)
declare let VConsole: any;

export interface IRoute {
  path: string,
  component: any,
  name: string
}

export interface IApplicationRouter {
  routes: IRoute[],
  sites?: IndexedType<any>
}

export interface IAppliationLaunchOption {
  el?: string;
  router: IApplicationRouter;
  app: any;
  template?: string;
}

// 为了支持动态替换router，替换传入Vue
class RouterWrapper {

  constructor(routes: IRoute[]) {
    this._router = new Router({
      mode: 'history',
      routes: routes
    })
  }

  flushRoutes(routes: IRoute[]) {
    let t: any = new Router({
      mode: 'history',
      routes: routes
    })
    t.init(this._router.app)
    this._router = t
  }

  // 带private的是为了模拟Router的接口
  private init(obj: any) {
    (<any>this._router).init(obj)
  }

  private get history() {
    return (<any>this._router).history
  }

  private addRoutes(obj: any) {
    this._router.addRoutes(obj)
  }

  push(location: string) {
    this._router.push(location)
  }

  // 回上一个
  back() {
    this._router.back();
  }

  private _router: Router;
}

export class Application {
  constructor(opt: IAppliationLaunchOption) {
    Application.shared = this;

    if (opt.el)
      this.el = opt.el;
    if (opt.template)
      this.template = opt.template;
    this.router = opt.router;
    this.app = opt.app;

    // 开发模式
    if (config.get('DEVELOP')) {
      // 启动console
      if (config.get('VCONSOLE')) {
        loadScript('https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js').then(() => {
          new VConsole();
        });
      }
    }
  }

  // 对应于vue初始化的设置
  el: string = '#app';
  router: IApplicationRouter;
  app: any;
  template: string = 'App';

  // vue-router的实例
  private _router: RouterWrapper;

  // 全局的单件
  static shared: Application;

  // 获得app的唯一id
  uniqueId(): string {
    if (this._uniqueid)
      return this._uniqueid;
    let id = Storage.shared.value("::n2::app::uid");
    if (id == null) {
      id = this.genUniqueId();
      Storage.shared.set("::n2::app::uid", id);
      this._uniqueid = id;
    } else {
      this._uniqueid = id;
    }
    return this._uniqueid;
  }

  protected genUniqueId(): string {
    return uuid(16, 16);
  }

  // app的唯一标识
  private _uniqueid: string;

  // 启动应用
  start() {
    this._router = new RouterWrapper(this.router.routes)
    // 启动VUE
    let opts: IndexedObject = {
      el: this.el,
      router: this._router,
      template: '<' + this.template + '/>',
      components: {}
    };
    opts.components[this.template] = this.app;
    new Vue(opts);
  }

  // 加载一个插件
  loadPlugin(plugin: any, name: string) {
    try {
      Vue.use(plugin);
    } catch (e) {
      // pass
    }
    Vue.prototype['$' + name] = plugin;
  }

  // 推入页面
  push(location: string) {
    this._router.push(location)
  }

  // 回上一个
  goback() {
    this._router.back()
  }
}
