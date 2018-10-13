import {KvObject} from "./Stl";

class _Config {

  // 默认配置
  default(cfg: KvObject<string, any>) {
    for (let k in cfg) {
      if (!(k in this._cur)) {
        this[k] = this._cur[k] = cfg[k];
      }
    }
  }

  // 添加根据host判断得配置
  host(host: RegExp, cfg: KvObject<string, any>) {
    if (!location.hostname.match(host))
      return;
    for (let k in cfg) {
      this[k] = this._cur[k] = cfg[k];
    }
  }

  get(key: string, def?: any): any {
    return key in this._cur ? this._cur[key] : def;
  }

  set(key: string, val: any) {
    this[key] = this._cur[key] = val;
  }

  delete(key: string) {
    if (key in this._cur) {
      delete this._cur[key];
      delete this[key];
    }
  }

  private _cur: KvObject<string, any> = {};
}

export let config = new _Config();
