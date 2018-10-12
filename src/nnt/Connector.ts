import {SObject, UrlT} from "./Kernel";
import {
  SignalChanged,
  SignalClose,
  SignalDataChanged,
  SignalDone,
  SignalEnd,
  SignalFailed,
  SignalOpen, SignalTimeout
} from "./Signals";
import {KvObject} from "./Stl";

export enum HttpMethod {
  GET,
  POST,
}

/** http连接器 */
export class CHttpConnector extends SObject {
  dispose() {
    super.dispose();
    this.data = undefined;
    this.fields = undefined;
  }

  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalEnd);
    this._signals.register(SignalDone);
    this._signals.register(SignalFailed);
    this._signals.register(SignalChanged);
  }

  /** 请求方式 */
  method = HttpMethod.GET;

  /** 全url */
  url: string;

  /** fields */
  fields: KvObject<string, any>;

  /** 获取的数据 */
  data: any;

  /** override 发送请求 */
  start() {
  }

  /** override 使用自动授权 */
  useCredentials() {
  }

  fullUrl(): string {
    let r = this.url;
    if (this.fields) {
      if (r.indexOf('?') == -1)
        r += '?';
      else
        r += '&';
      r += UrlT.MapToField(this.fields);
    }
    return r;
  }
}

/** socket连接器 */
export abstract class CSocketConnector extends SObject {
  /** 地址 */
  host: string;

  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalOpen);
    this._signals.register(SignalClose);
    this._signals.register(SignalDataChanged);
    this._signals.register(SignalTimeout);
    this._signals.register(SignalFailed);
  }

  /** 是否已经打开 */
  abstract isopened(): boolean;

  /** 连接服务器 */
  abstract open();

  /** 断开连接 */
  abstract close();

  /** 发送对象 */
  abstract write(obj: any);

  /** 监听对象 */
  abstract watch(obj: any, on: boolean);
}

