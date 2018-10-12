/** 序列化的接口 */
import {CMap, CSet, KvObject, MapType, SetType} from "./Stl";
import {Invoke1} from "./Typescript";
import {printf} from "./Compat";

/** 基础数字＋字符串 */
type numstr = number | string | any;

/** JSONOBJ+字符串 */
type jsonobj = string | Object;

/** 增加引用计数 */
export function grab<T>(o: T): T {
  if (o == null)
    return undefined;
  (<any>o).grab();
  return o;
}

/** 减计数对象 */
export function drop<T>(o: T): T {
  if (o == null)
    return undefined;
  return (<any>o).drop();
}

/** 直接析构一个对象 */
export function dispose<T>(o: T) {
  if (o == null)
    return;
  (<any>o).dispose();
}

/** 带保护的取一堆中第一个不是空的值 */
export function nonnull1st<T>(def: T, ...p: T[]) {
  for (let i = 0; i < p.length; ++i) {
    let v = p[i];
    if (v != null)
      return v;
  }
  return def;
}

/** 带保护的判断对象是不是 0 */
export function isZero(o: any): boolean {
  if (o == null || o == 0)
    return true;
  if (o.length)
    return o.length == 0;
  return false;
}

function SafeNumber(o: number, def = 0): number {
  return isNaN(o) ? def : o;
}

/** 转换到 float */
export function toFloat(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof(o);
  if (tp == 'number')
    return SafeNumber(o, def);
  if (tp == 'string') {
    let v = parseFloat(o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber();
  return def;
}

/** 转换到 int */
export function toInt(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof(o);
  if (tp == 'number' || tp == 'string') {
    let v = parseInt(o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber() >> 0;
  return def;
}

/** 转换到数字
 @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
 */
export function toNumber(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof(o);
  if (tp == 'number')
    return SafeNumber(o, def);
  if (tp == 'string') {
    if (o.indexOf('.') == -1) {
      let v = parseInt(o);
      return SafeNumber(v, def);
    }
    let v = parseFloat(o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber();
  return def;
}

/** 转换到字符串 */
export function asString(o: any, def = ''): string {
  if (o == null)
    return def;
  let tp = typeof(o);
  if (tp == 'string')
    return o;
  if (tp == 'number')
    return SafeNumber(o).toString();
  if (o.toString)
    return o.toString();
  return def;
}

/** 转换到json字串 */
export function toJson(o: any, def = null): string {
  let t = typeof(o);
  if (t == 'string')
    return o;
  let r = null;
  try {
    r = JSON.stringify(o);
  }
  catch (ex) {
    r = def;
  }
  return r;
}

/** 转换到对象 */
export function toJsonObject(o: jsonobj, def = null): Object {
  let t = typeof(o);
  if (t == 'string')
    return JSON.parse(<string>o);
  else if (t == 'object')
    return o;
  return def;
}

/** 格式化字符串 */
export function formatString(fmt: string, ...p: any[]): string {
  try {
    return Invoke1(printf, this, p, fmt);
  } catch (err) {
    console.exception('format: ' + fmt + '\nargus: ' + p + '\n' + err);
  }
  return '';
}

export function formatStringV(fmt: string, p: any[]): string {
  try {
    return Invoke1(printf, this, p, fmt);
  } catch (err) {
    console.exception('format: ' + fmt + '\nargus: ' + p + '\n' + err);
  }
  return '';
}

/** 格式化字符对象 */
export class FormatString {
  constructor(fmt?: any, ...args: any[]) {
    this.fmt = fmt;
    this.args = args;
  }

  /** fmt 根据业务的实现，可能为int的id，一般情况下为string，所以设置为any兼容业务的复杂性 */
  fmt: any;

  /** 带上的参数 */
  args: any[];

  toString(): string {
    return formatStringV(this.fmt, this.args);
  }
}

/** json处理，保护防止crash并且打印出数据 */
export function json_encode(obj: Object): string {
  return JSON.stringify(obj);
}

export function json_decode(str: string): any {
  let r;
  try {
    r = JSON.parse(str);
  } catch (err) {
    console.exception(err);
  }
  return r;
}

/** 带保护的判断对象是不是空 */
export function IsEmpty(o: any): boolean {
  if (o == null)
    return true;
  let tp = typeof(o);
  if (tp == 'string') {
    if (tp.length == 0)
      return true;
    return o.match(/^\s*$/) != null;
  }
  if (o instanceof Array) {
    return (<any>o).length == 0;
  }
  if (o instanceof CMap) {
    return (<CMap<any, any> >o).length != 0;
  }
  if (o instanceof CSet) {
    return (<CSet<any> >o).size != 0;
  }
  return Object.keys(o).length == 0;
}

export interface ISerializable {
  /** 序列化对象到流，返回结果 */
  serialize(stream: any): any;

  /** 从流中构建对象 */
  unserialize(stream: any): boolean;
}

/** 缓存策略控制接口 */
export interface ICacheObject {
  // 是否强制刷新
  cacheFlush: boolean;

  // 是否已经更新
  cacheUpdated: boolean;

  // 过期的时间段
  cacheTime: number;

  // 获得唯一标记
  keyForCache(): string;

  // 值
  valueForCache(): any;
}

/** 时间日期 */
export class DateTime {
  constructor(ts?: number) {
    if (ts === undefined)
      ts = DateTime.Timestamp();
    this.timestamp = ts;
  }

  /** 当前的时间 */
  static Now(): number {
    return new Date().getTime() / 1000;
  }

  /** 当前的时间戳 */
  static Timestamp(): number {
    return (new Date().getTime() / 1000) >> 0;
  }

  /** 一段时间 */
  static Interval(ts: number): DateTime {
    // 偏移GMT, -2880000是 GMT8 1970/1/1 0:0:0
    return new DateTime(ts - 2880000);
  }

  /** 从字符串转换 */
  static parse(s: string): DateTime {
    let v = Date.parse(s);
    // safari下日期必须用/分割，但是chrome支持-或者/的格式，所以如果是NaN，则把所有的-转换成/
    if (isNaN(v)) {
      if (s.indexOf('-') != -1) {
        s = s.replace(/-/g, '/');
        v = Date.parse(s);
      }
    }
    return new DateTime(v / 1000);
  }

  /** 未来 */
  future(ts: number): this {
    this.timestamp += ts;
    return this;
  }

  /** 过去 */
  past(ts: number): this {
    this.timestamp -= ts;
    return this;
  }

  /** 计算间隔 */
  diff(r: DateTime): DateTime {
    return new DateTime(r._timestamp - this._timestamp);
  }

  private _changed = false;
  private _date = new Date();
  private _timestamp: number;
  get timestamp(): number {
    if (this._changed) {
      this._timestamp = this._date.getTime() / 1000;
      this._changed = false;
    }
    return this._timestamp;
  }

  set timestamp(val: number) {
    if (this._timestamp === val)
      return;
    this._timestamp = val;
    this._date.setTime(this._timestamp * 1000);
  }

  get year(): number {
    return this._date.getFullYear();
  }

  set year(val: number) {
    this._changed = true;
    this._date.setFullYear(val);
  }

  get month(): number {
    return this._date.getMonth();
  }

  set month(val: number) {
    this._changed = true;
    this._date.setMonth(val);
  }

  get day(): number {
    return this._date.getDate();
  }

  set day(val: number) {
    this._changed = true;
    this._date.setDate(val);
  }

  get hyear(): number {
    return this.year;
  }

  set hyear(val: number) {
    this.year = val;
  }

  get hmonth(): number {
    return this.month + 1;
  }

  set hmonth(val: number) {
    this.month = val - 1;
  }

  get hday(): number {
    return this.day;
  }

  set hday(val: number) {
    this.day = val;
  }

  get hour(): number {
    return this._date.getHours();
  }

  set hour(val: number) {
    this._changed = true;
    this._date.setHours(val);
  }

  get minute(): number {
    return this._date.getMinutes();
  }

  set minute(val: number) {
    this._changed = true;
    this._date.setMinutes(val);
  }

  get second(): number {
    return this._date.getSeconds();
  }

  set second(val: number) {
    this._changed = true;
    this._date.setSeconds(val);
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   * ("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
   * ("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
   * ("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
   * ("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
   */
  toString(fmt?: any): string {
    if (fmt)
      return (<any>this._date).pattern(fmt);
    return this._date.toString();
  }

  static MINUTE = 60;
  static MINUTE_5 = 300;
  static MINUTE_15 = 900;
  static MINUTE_30 = 1800;
  static HOUR = 3600;
  static HOUR_2 = 7200;
  static HOUR_6 = 21600;
  static HOUR_12 = 43200;
  static DAY = 86400;
  static MONTH = 2592000;
  static YEAR = 31104000;

  static Dyears(ts: number, up: boolean = true) {
    return Math.floor(ts / this.YEAR);
  }

  static Dmonths(ts: number, up: boolean = true) {
    let v;
    if (up) {
      v = ts % this.YEAR;
      v = Math.floor(v / this.MONTH);
    } else {
      v = Math.floor(ts / this.MONTH);
    }
    return v;
  }

  static Ddays(ts: number, up: boolean = true) {
    let v;
    if (up) {
      v = ts % this.MONTH;
      v = Math.floor(v / this.DAY);
    } else {
      v = Math.floor(ts / this.DAY);
    }
    return v;
  }

  static Dhours(ts: number, up: boolean = true) {
    let v;
    if (up) {
      v = ts % this.DAY;
      v = Math.floor(v / this.HOUR);
    } else {
      v = Math.floor(ts / this.HOUR);
    }
    return v;
  }

  static Dminutes(ts: number, up: boolean = true) {
    let v;
    if (up) {
      v = ts % this.HOUR;
      v = Math.floor(v / this.MINUTE);
    } else {
      v = Math.floor(ts / this.MINUTE);
    }
    return v;
  }

  static Dseconds(ts: number, up: boolean = true) {
    let v;
    if (up) {
      v = ts % this.MINUTE;
    } else {
      v = ts;
    }
    return v;
  }

  /** 计算diff-year，根绝suffix的类型返回对应的类型 */
  dyears(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Dyears(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  /** 计算diff-months */
  dmonths(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Dmonths(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  /** 计算diff-days */
  ddays(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Ddays(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  /** 计算diff-hours */
  dhours(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Dhours(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  /** 计算diff-mins */
  dminutes(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Dminutes(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  /** 计算diff-secs */
  dseconds(up: boolean = true, suffix: any | string = 0): any {
    let v = DateTime.Dseconds(this._timestamp, up);
    if (typeof(suffix) == 'string')
      return v ? v + suffix : '';
    return v + suffix;
  }

  isSameDay(r: DateTime): boolean {
    return this.year == r.year &&
      this.month == r.month &&
      this.day == r.day;
  }
}

/** 提供操作基础对象的工具函数 */
export class ObjectT {
  /** 比较两个实例是否相等
   @brief 优先使用比较函数的结果
   */
  static IsEqual<L, R>(l: L, r: R, eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l == null || r == null)
      return false;
    if (eqfun)
      return eqfun.call(eqctx, l, r);
    if (l && (<any>l).isEqual)
      return (<any>l).isEqual(r);
    if (r && (<any>r).isEqual)
      return (<any>r).isEqual(l);
    return <any>l == <any>r;
  }

  /** 根据查询路径获取值 */
  static GetValueByKeyPath(o: any, kp: string, def?: any): any {
    if (o == null)
      return def;
    let ks = kp.split('.');
    for (let i = 0; i < ks.length; ++i) {
      o = o[ks[i]];
      if (o == null)
        return def;
    }
    return o;
  }

  /** 根据查询路径设置值 */
  static SetValueByKeyPath(o: any, kp: string, v: any) {
    if (o == null) {
      console.warn("不能对null进行keypath的设置操作");
      return;
    }
    let ks = kp.split('.');
    let l = ks.length - 1;
    for (let i = 0; i < l; ++i) {
      let k = ks[i];
      let t = o[k];
      if (t == null) {
        t = {};
        o[k] = t;
      }
      o = t;
    }
    o[ks[l]] = v;
  }
}

/** 随机数 */
export class Random {
  // 半开区间 [from, to)
  static Rangei(from: number, to: number, close = false): number {
    if (close)
      return Math.round(Random.Rangef(from, to));
    return Math.floor(Random.Rangef(from, to));
  }

  static Rangef(from: number, to: number): number {
    return Math.random() * (to - from) + from;
  }
}

/** 提供了操作 array 的工具函数 */
export class ArrayT {
  /** 最大值 */
  static Max<T>(arr: T[]): T {
    let t = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = arr[i];
      if (t < v)
        t = v;
    }
    return t;
  }

  static QueryMax<T>(arr: T[], func?: (e: T) => any): T {
    let t = func ? func(arr[0]) : arr[0];
    let o = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = func ? func(arr[i]) : arr[i];
      if (t < v) {
        t = v;
        o = arr[i];
      }
    }
    return o;
  }

  /** 最小值 */
  static Min<T>(arr: T[]): T {
    let t = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = arr[i];
      if (t > v)
        t = v;
    }
    return t;
  }

  static QueryMin<T>(arr: T[], func?: (e: T) => any): T {
    let t = func ? func(arr[0]) : arr[0];
    let o = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = func ? func(arr[i]) : arr[i];
      if (t > v) {
        t = v;
        o = arr[i];
      }
    }
    return o;
  }

  /** 初始化数量 */
  static Allocate<T>(count: number, def?: any): T[] {
    let isfun = typeof(def) == 'function';
    let f = <any>def;
    let r = [];
    for (let i = 0; i < count; ++i) {
      let o = isfun ? f(i) : def;
      r.push(o);
    }
    return r;
  }

  /** 转换成数组 */
  static ToArray(o: any): any[] {
    if (o == null)
      return [];
    if (o instanceof Array)
      return o;
    return [o];
  }

  /** 合并所有的数组 */
  static Merge<T>(...arr: Array<Array<T>>): T[] {
    let r = [];
    arr.forEach((arr: Array<T>) => {
      r = r.concat(arr);
    });
    return r;
  }

  /** 使用比较函数来判断是否包含元素 */
  static Contains<L, R>(arr: L[], o: R, eqfun?: (l: L, o: R) => boolean, eqctx?: any): boolean {
    return arr.some((each: any): boolean => {
      return ObjectT.IsEqual(each, o, eqfun, eqctx);
    }, this);
  }

  /** 合并 */
  static Concat<T>(l: T[], r: T[]): T[] {
    if (l == null)
      return r;
    if (r == null)
      return l;
    return l.concat(r);
  }

  /** 压入一组数据 */
  static PushObjects<L>(arr: L[], p: L[]) {
    p && p.forEach((e: L) => {
      arr.push(e);
    });
  }

  /** 查询 */
  static QueryObject<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: any): T {
    let r = def;
    arr.some((o: T, idx: number): boolean => {
      if (fun.call(ctx, o, idx)) {
        r = o;
        return true;
      }
      return false;
    }, this);
    return r;
  }

  /** 查找所有符合条件的对象 */
  static QueryObjects<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any): T[] {
    let r = [];
    arr.forEach((o: T, idx: number) => {
      if (fun.call(ctx, o, idx))
        r.push(o);
    });
    return r;
  }

  /** 查询条件对应的索引 */
  static QueryIndex<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: number): number {
    let r = def;
    arr.some((o: T, idx: number): boolean => {
      if (fun.call(ctx, o, idx)) {
        r = idx;
        return true;
      }
      return false;
    }, this);
    return r;
  }

  /** 不为指定数据的数组长度 */
  static TrustLength<T>(arr: T[], tgt: T = null): number {
    let r = 0;
    arr.forEach((e) => {
      if (e != tgt)
        ++r;
    });
    return r;
  }

  /** 覆盖指定数据到数组 */
  static TrustAddObject<T>(arr: T[], src: T, tgt: T = null): boolean {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] == tgt) {
        arr[i] = src;
        return true;
      }
    }
    return false;
  }

  /** 移除数据 */
  static TrustRemoveObject<T>(arr: T[], src: T, tgt: T = null) {
    let idx = arr.indexOf(src);
    if (idx == -1)
      return;
    arr[idx] = tgt;
  }

  /** 覆盖数组 */
  static TrustSet<T>(arr: T[], tgt: T[], def = null) {
    for (let i = 0; i < arr.length; ++i) {
      let o = tgt[i];
      arr[i] = o ? o : def;
    }
  }

  /** 弹出数据 */
  static TrustPop<T>(arr: T[], tgt: T[], def = null) {
    for (let i = 0; i < arr.length; ++i) {
      let o = this.RemoveObjectAtIndex(tgt, 0);
      arr[i] = o ? o : def;
    }
  }

  /** 清除 */
  static TrustClear<T>(arr: T[], tgt: T = null) {
    for (let i = 0; i < arr.length; ++i)
      arr[i] = tgt;
  }

  /** 插入元素 */
  static InsertObjectAtIndex<T>(arr: T[], o: T, idx: number) {
    arr.splice(idx, 0, o);
  }

  /** 清空数组，并挨个回调 */
  static Clear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
    if (cb)
      arr.forEach(cb, ctx);
    arr.length = 0;
  }

  /** 安全的清空，以避免边加边删的边际效应 */
  static SafeClear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
    ArrayT.Clear(ArrayT.Clone(arr), cb, ctx);
    arr.length = 0;
  }

  /** 安全的增加，如果为null，则推入def，如果def也是null，则不推入 */
  static SafePush<T>(arr: T[], o: T, def?: T) {
    let obj = o ? o : def;
    if (obj)
      arr.push(obj);
  }

  /** 填充一个数组 */
  static Fill<T>(arr: T[], cnt: number, instance: () => any, ctx?: any): T[] {
    if (arr == null)
      arr = [];
    while (cnt--) {
      arr.push(instance.call(ctx));
    }
    return arr;
  }

  /** 使用类型来自动实例化并填充数组 */
  static FillType<T>(arr: T[], cnt: number, cls: any): T[] {
    if (arr == null)
      arr = [];
    while (cnt--) {
      arr.push(new cls());
    }
    return arr;
  }

  /** 带保护的两两遍历 */
  static ForeachWithArray(arrl: any[], arrr: any[], cb: (l: any, r: any, idx: number) => void, ctx?: any, def?: any) {
    let cntl = arrl.length, cntr = arrr.length;
    let cnt = Math.max(cntl, cntr);
    for (let i = 0; i < cnt; ++i) {
      let ol = i < cntl ? arrl[i] : def;
      let or = i < cntr ? arrr[i] : def;
      cb.call(ctx, ol, or, i);
    }
  }

  /** 带 break 的索引遍历 */
  static Foreach<T>(arr: T[], cb: (o: T, idx: number) => boolean, ctx?: any) {
    arr.every((each: any, idx: number): boolean => {
      return cb.call(ctx, each, idx);
    }, this);
  }

  /** 按照行来遍历 */
  static ForeachRow<T>(arr: T[], columns: number, cb: (o: T, row: number, col: number, idx?: number, rows?: number) => boolean, ctx?: any) {
    let rows = Math.ceil(arr.length / columns);
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < columns; ++c) {
        let i = r * columns + c;
        if (cb.call(ctx, arr[i], r, c, i, rows) == false)
          return;
      }
    }
  }

  /** 随机一个 */
  static Random<T>(arr: T[]): T {
    if (arr.length == 0)
      return null;
    return arr[Random.Rangei(0, arr.length)];
  }

  /** 安全的遍历，以避免边删边加的边际效应 */
  static SafeForeach(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any) {
    ArrayT.Foreach(ArrayT.Clone(arr), cb, ctx);
  }

  /** 迭代数组，提供结束的标识 */
  static Iterate<T>(arr: T[], cb: (o: T, idx: number, end: boolean) => boolean, ctx: any) {
    if (arr.length == 0)
      return;
    let len = arr.length - 1;
    ArrayT.Foreach(arr, function (o: any, idx: number): boolean {
      return cb.call(ctx, o, idx, idx == len);
    }, ctx);
  }

  /** 使用指定索引全遍历数组，包括索引外的 */
  static FullEach<T>(arr: T[], idx: number, cbin: (o: T, idx: number) => void, cbout: (o: T, idx: number) => void) {
    let len = Math.min(arr.length, idx);
    for (let i = 0; i < len; ++i) {
      cbin(arr[i], i);
    }
    if (len >= idx) {
      len = arr.length;
      for (let i = idx; i < len; ++i) {
        cbout(arr[i], i);
      }
    }
  }

  /** 带筛选器的统计个数 */
  static LengthQuery(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any): number {
    let ret: number = 0;
    arr.forEach((each: any, idx: number) => {
      if (cb.call(ctx, each, idx))
        ret += 1;
    }, this);
    return ret;
  }

  /** 删除一个对象 */
  static RemoveObject<T>(arr: T[], obj: T): boolean {
    if (obj == null || arr == null)
      return false;
    let idx = arr.indexOf(obj);
    arr.splice(idx, 1);
    return true;
  }

  /** 删除指定索引的对象 */
  static RemoveObjectAtIndex<T>(arr: T[], idx: number): T {
    let r = arr.splice(idx, 1);
    return r[0];
  }

  /** 使用筛选器来删除对象 */
  static RemoveObjectByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T {
    for (let i = 0; i < arr.length; ++i) {
      let e = arr[i];
      if (filter.call(ctx, e, i)) {
        arr.splice(i, 1);
        return e;
      }
    }
    return null;
  }

  static RemoveObjectsByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[] {
    let r = [];
    let res = arr.filter((o, idx): boolean => {
      if (filter.call(ctx, o, idx)) {
        r.push(o);
        return false
      }
      return true;
    }, this);
    if (arr.length == res.length)
      return r;
    ArrayT.Set(arr, res);
    return r;
  }

  /** 移除位于另一个 array 中的所有元素 */
  static RemoveObjectsInArray<T>(arr: T[], r: T[]) {
    let res = arr.filter((each: any, idx: number): boolean => {
      return !ArrayT.Contains(r, each);
    }, this);
    ArrayT.Set(arr, res);
  }

  /** 使用位于另一个 array 中对应下标的元素 */
  static RemoveObjectsInIndexArray<T>(arr: T[], r: number[]): T[] {
    let rm = [];
    let res = arr.filter((each: T, idx: number): boolean => {
      if (ArrayT.Contains(r, idx) == true) {
        rm.push(each);
        return false;
      }
      return true;
    }, this);
    ArrayT.Set(arr, res);
    return rm;
  }

  /** 调整大小 */
  static Resize<T>(arr: T[], size: number, def?: T) {
    if (arr.length < size) {
      let cnt = size - arr.length;
      let base = arr.length;
      for (let i = 0; i < cnt; ++i) {
        arr.push(def);
      }
    } else if (arr.length > size) {
      arr.length = size;
    }
  }

  /** 上浮满足需求的对象 */
  static Rise<T>(arr: T[], q: (e: T) => boolean) {
    let r = [];
    let n = [];
    arr.forEach((e: T) => {
      if (q(e))
        r.push(e);
      else
        n.push(e);
    });
    this.Set(arr, r.concat(n));
  }

  /** 下沉满足需求的对象 */
  static Sink<T>(arr: T[], q: (e: T) => boolean) {
    let r = [];
    let n = [];
    arr.forEach((e: T) => {
      if (q(e))
        r.push(e);
      else
        n.push(e);
    });
    this.Set(arr, n.concat(r));
  }

  /** 使用另一个数组来填充当前数组 */
  static Set<T>(arr: T[], r: T[]) {
    arr.length = 0;
    r.forEach((o) => {
      arr.push(o);
    }, this);
  }

  /** 复制 */
  static Clone<T>(arr: T[]): T[] {
    return arr.concat();
  }

  /** 转换 */
  static Convert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r = [];
    arr.forEach((o: L, idx: number) => {
      r.push(convert.call(ctx, o, idx));
    });
    return r;
  }

  /** 安全转换，如果结果为null，则跳过 */
  static SafeConvert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r = [];
    arr.forEach((o: L, idx: number) => {
      let t = convert.call(ctx, o, idx);
      if (t)
        r.push(t);
    });
    return r;
  }

  /** 提取 */
  static Filter<L, R>(arr: L[], filter: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r = [];
    arr.forEach((o: L, idx: number) => {
      let r = filter.call(ctx, o, idx);
      if (r)
        r.push(r);
    });
    return r;
  }

  /** 数组 l 和 r 的共有项目 */
  static ArrayInArray<T>(l: T[], r: T[]): T[] {
    return l.filter((o): boolean => {
      return ArrayT.Contains(r, o);
    }, this);
  }

  /** 合并 */
  static Combine<T>(l: T[], sep: any): any {
    let r = l[0];
    for (let i = 1; i < l.length; i++) {
      r += sep + l[i];
    }
    return r;
  }

  /** 检查两个是否一样 */
  static EqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l.length != r.length)
      return false;
    return r.every((o: any): boolean => {
      return ArrayT.Contains(l, o, eqfun, eqctx);
    }, this);
  }

  /** 严格(包含次序)检查两个是否一样 */
  static StrictEqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l.length != r.length)
      return false;
    return r.every((o: any, idx: number): boolean => {
      return ObjectT.IsEqual(o, r[idx], eqfun, eqctx);
    }, this);
  }

  /** 乱序 */
  static Disorder<T>(arr: T[]) {
    arr.sort((): number => {
      return Math.random();
    });
  }

  /** 截取尾部的空对象 */
  static Trim<T>(arr: T[], emp: T = null) {
    let t = [];
    for (let i = arr.length; i != 0; --i) {
      let o = arr[i - 1];
      if (t.length == 0 && o == emp)
        continue;
      t.push(o);
    }
    ArrayT.Set(arr, t.reverse());
  }

  /** 去重 */
  static HashUnique<T>(arr: T[], hash: boolean = true) {
    let t = [];
    if (hash) {
      let h = {};
      arr.forEach((o: any) => {
        let k = o.hashCode;
        if (h[k])
          return;
        t.push(o);
        h[k] = true;
      });
    }
    else {
      arr.forEach((o: any) => {
        if (t.indexOf(o) == -1)
          t.push(o);
      });
    }
    this.Set(arr, t);
  }

  static Unique<T>(arr: T[], eqfun?: (l: T, o: T) => boolean, eqctx?: any) {
    let t = [];
    arr.forEach((o: any) => {
      if (this.Contains(t, o, eqfun, eqctx) == false)
        t.push(o);
    });
    this.Set(arr, t);
  }

  /** 取得一段 */
  static RangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
    let n = arr.length;
    if (pos < 0) {
      pos = n + pos;
      if (pos < 0)
        return arr;
    }
    if (pos >= n)
      return [];
    let c = len == null ? n : pos + len;
    return arr.slice(pos, c);
  }

  /** 弹出一段 */
  static PopRangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
    let n = arr.length;
    if (pos < 0) {
      pos = n + pos;
      if (pos < 0) {
        let r = arr.concat();
        arr.length = 0;
        return r;
      }
    }
    if (pos >= n)
      return [];
    let c = len == null ? n - pos : len;
    return arr.splice(pos, c);
  }

  /** 根据长度拆成几个Array */
  static SplitByLength<T>(arr: Array<T>, len: number): Array<Array<T>> {
    let r = [];
    let n = Math.ceil(arr.length / len);
    for (let i = 0; i < n; ++i) {
      r.push(this.RangeOf(arr, i * len, len));
    }
    return r;
  }

  /** 快速返回下一个或上一个 */
  static Next<T>(arr: Array<T>, obj: T, def?: T): T {
    let idx = arr.indexOf(obj);
    if (idx == -1)
      return def;
    if (idx + 1 == arr.length)
      return def;
    return arr[idx + 1];
  }

  static Previous<T>(arr: Array<T>, obj: T, def?: T): T {
    let idx = arr.indexOf(obj);
    if (idx == -1)
      return def;
    if (idx == 0)
      return def;
    return arr[idx - 1];
  }
}

/** set 的工具类 */
export class SetT {
  /** 删除对象 */
  static RemoveObject<T>(s: SetType<T>, o: T) {
    s.delete(o);
  }

  /** 复制 */
  static Clone<T>(s: SetType<T>): SetType<T> {
    let r = new CSet<T>();
    (<any>s).forEach((o: T) => {
      r.add(o);
    }, this);
    return r;
  }

  /** 转换到 array */
  static ToArray<T>(s: SetType<T>): Array<T> {
    let r = new Array<T>();
    (<any>s).forEach((o: T) => {
      r.push(o);
    }, this);
    return r;
  }

  /** 清空 */
  static Clear<T>(s: SetType<T>, cb?: (o: T) => void, ctx?: any) {
    if (s.size == 0)
      return;
    if (cb)
      (<any>s).forEach(cb, ctx);
    s.clear();
  }

  /** 带保护的清空，以避免边际效应 */
  static SafeClear<T>(s: SetType<T>, cb: (o: T) => void, ctx?: any) {
    if (s.size == 0)
      return;
    let ns: any = SetT.Clone(s);
    s.clear();
    ns.forEach(cb, ctx);
  }
}

/** map 的工具类 */
export class MapT {
  /** 获取 */
  static Get<K, V>(m: MapType<K, V>, k: K): V {
    return m[<any>k];
  }

  /** 获取所有的value */
  static GetValues<K, V>(m: MapType<K, V>): Array<V> {
    let r = [];
    this.Foreach(m, (k, v) => {
      r.push(v);
    });
    return r;
  }

  /** 增加 */
  static Add<K, V>(m: MapType<K, V>, k: K, v: V) {
    m[<any>k] = v;
  }

  /** 遍历 */
  static Foreach<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => void, ctx?: any) {
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      fun.call(ctx, k, m[k]);
    }, this);
  }

  /** 转换 */
  static ToArray<K, V, T>(m: MapType<K, V>, fun: (k: string, v: V) => T, ctx?: any): Array<T> {
    let r = [];
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      let obj = fun.call(ctx, k, m[k]);
      r.push(obj);
    }, this);
    return r;
  }

  static SafeToArray<K, V, T>(m: MapType<K, V>, fun: (k: string, v: V) => T, ctx?: any): Array<T> {
    let r = [];
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      let obj = fun.call(ctx, k, m[k]);
      if (obj)
        r.push(obj);
    }, this);
    return r;
  }

  /** 取值 */
  static QueryObject<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): [K, V] {
    let keys = Object.keys(m);
    for (let i = 0; i < keys.length; ++i) {
      let k = keys[i];
      if (fun.call(ctx, k, m[k]))
        return [<any>k, m[k]];
    }
    return null;
  }

  static QueryObjects<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): MapType<K, V> {
    let keys = Object.keys(m);
    let r: any = {};
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r[k] = v;
    });
    return r;
  }

  /** 获取值 */
  static QueryValue<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): V {
    let fnd = this.QueryObject(m, fun, ctx);
    return fnd ? fnd[1] : null;
  }

  static QueryValues<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): V[] {
    let keys = Object.keys(m);
    let r: any = [];
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r.push(v);
    });
    return r;
  }

  static QueryKey<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): K {
    let fnd = this.QueryObject(m, fun, ctx);
    return fnd ? fnd[0] : null;
  }

  static QueryKeys<K, V>(m: MapType<K, V>, fun: (k: K, v: V) => boolean, ctx?: any): K[] {
    let keys = Object.keys(m);
    let r: any = [];
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r.push(k);
    });
    return r;
  }

  /** 判断是否为空 */
  static IsEmpty<K, V>(m: MapType<K, V>): boolean {
    if (m == null)
      return true;
    return Object.keys(m).length == 0;
  }

  /** 删除key的元素 */
  static RemoveKey<K, V>(m: MapType<K, V>, k: K) {
    delete m[<any>k];
  }

  /** 清空 */
  static Clear<K, V>(m: MapType<K, V>, cb?: (k: K, o: V) => void, ctx?: any) {
    MapT.Foreach(m, (k: K, v: V) => {
      if (cb)
        cb.call(ctx, k, v);
      delete m[<any>k];
    }, this);
  }

  /** 合并 */
  static Concat(l: MapType<any, any>, r: MapType<any, any>) {
    if (l == null)
      return r;
    if (r == null)
      return l;
    MapT.Foreach(r, (k, v) => {
      l[k] = v;
    }, this);
  }

  /** 复制 */
  static Clone<K, V>(l: MapType<K, V>): MapType<K, V> {
    let r = new KvObject<K, V>();
    MapT.Foreach(l, (k: any, v) => {
      r[k] = v;
    }, this);
    return r;
  }

  /** 获取长度 */
  static Length<T>(m: T): number {
    return Object.keys(m).length;
  }

  /** 转换成普通Object */
  static Simplify<K, V>(m: MapType<K, V>): Object {
    let obj = {};
    this.Foreach(m, (k, v) => {
      obj[<any>k] = <any>v;
    });
    return obj;
  }
}

/** 使用索引的 map，可以按照顺序来获取元素 */
export class IndexedMap<K, T> {
  constructor() {
  }

  /** 添加 */
  add(k: K, v: T) {
    if (<any>k in this._map) {
      let idx = this._keys.indexOf(k);
      this._keys[idx] = k;
      this._vals[idx] = v;
    }
    else {
      this._keys.push(k);
      this._vals.push(v);
    }

    this._map[<any>k] = v;
  }

  /** 替换 */
  replace(k: K, v: T) {
    if (<any>k in this._map) {
      let idx = this._keys.indexOf(k);
      this._vals[idx] = v;
    }
    else {
      this._keys.push(k);
      this._vals.push(v);
    }

    this._map[<any>k] = v;
  }

  /** 删除 */
  remove(k: K): T {
    if (!(<any>k in this._map))
      return null;

    // k和v是1-1，所以indexOfKey和indexOfVal一致
    let idx = this._keys.indexOf(k);
    let val = this._vals[idx];
    ArrayT.RemoveObjectAtIndex(this._keys, idx);
    ArrayT.RemoveObjectAtIndex(this._vals, idx);

    delete this._map[<any>k];
    return val;
  }

  /** 获得大小 */
  get length(): number {
    return this._keys.length;
  }

  /** 清空 */
  clear() {
    this._keys.length = 0;
    this._vals.length = 0;
    this._map = {};
  }

  /** 遍历 */
  forEach(cb: (k: K, v: T) => void, ctx?: any) {
    this._keys.forEach((k: K, idx: number) => {
      let v = this._vals[idx];
      cb.call(ctx, k, v);
    }, this);
  }

  iterateEach(cb: (k: K, v: T) => boolean, ctx?: any) {
    for (let i = 0, len = this._keys.length; i < len; ++i) {
      let k = this._keys[i];
      let v = this._vals[i];
      if (!cb.call(ctx, k, v))
        break;
    }
  }

  /** 是否存在k */
  contains(k: K): boolean {
    return <any>k in this._map;
  }

  /** 取得k的下标 */
  indexOfKey(k: K): number {
    return this._keys.indexOf(k);
  }

  /** 使用下标取得数据 */
  objectForKey(k: K): T {
    return this._map[<any>k];
  }

  objectForIndex(idx: number): T {
    let k: any = this._keys[idx];
    return this._map[k];
  }

  keyForIndex(idx: number): K {
    return this._keys[idx];
  }

  get keys(): Array<K> {
    return this._keys.concat();
  }

  get values(): Array<T> {
    return this._vals;
  }

  private _map = {};
  private _keys = new Array<K>();
  private _vals = new Array<T>();
}

export class IndexedMapT {
  static RemoveObjectByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): [K, T] {
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (filter.call(ctx, k, v)) {
        map.remove(k);
        return [k, v];
      }
    }
    return null;
  }

  static RemoveObjectsByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): Array<[K, T]> {
    let r = new Array<[K, T]>();
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (filter.call(ctx, k, v)) {
        map.remove(k);
        r.push([k, v]);
      }
    }
    return r;
  }

  static QueryObject<K, T>(map: IndexedMap<K, T>, query: (k: K, v: T) => boolean, ctx?: any): T {
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (query.call(ctx, k, v))
        return v;
    }
    return null;
  }

  static Convert<K, T, V>(arr: Array<V>, convert: (v: V) => [K, T], ctx?: any): IndexedMap<K, T> {
    let r = new IndexedMap<K, T>();
    arr.forEach((e: V) => {
      let o = convert.call(ctx, e);
      r.add(o[0], o[1]);
    });
    return r;
  }
}

/** 多索引map */
export class MultiMap<K, V> {
  add(k: K, v: V): this {
    let arr = this._map.objectForKey(k);
    if (arr == null) {
      arr = new Array<V>();
      this._map.add(k, arr);
    }
    arr.push(v);
    return this;
  }

  replace(k: K, v: Array<V>) {
    this._map.replace(k, v);
  }

  objectForKey(k: K): V[] {
    return this._map.objectForKey(k);
  }

  remove(k: K): V[] {
    return this._map.remove(k);
  }

  forEach(proc: (k: K, arr: V[]) => void, ctx?: any) {
    this._map.forEach(proc, ctx);
  }

  iterateEach(proc: (k: K, arr: V[]) => boolean, ctx?: any) {
    this._map.iterateEach(proc, ctx);
  }

  get keys(): Array<K> {
    return this._map.keys;
  }

  private _map = new IndexedMap<K, Array<V>>();
}
