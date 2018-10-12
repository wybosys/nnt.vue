import {ArrayT, asString, MultiMap, StringT, toFloat, toInt} from "./Kernel";
import {CMap} from "./Stl";

type Class<T> = { new(...args: any[]): T, [key: string]: any };
type AnyClass = Class<any>;
type clazz_type = AnyClass | string;
type IndexedObject = { [key: string]: any };

interface FieldOption {
  // 唯一序号，后续类似pb的协议会使用id来做数据版本兼容
  id: number;

  // 默认值
  val?: any;

  // 可选
  optional: boolean;

  // 读取控制
  input: boolean;
  output: boolean;

  // 类型标签
  array?: boolean;
  map?: boolean;
  multimap?: boolean;
  string?: boolean;
  integer?: boolean;
  double?: boolean;
  boolean?: boolean;
  enum?: boolean;
  file?: boolean;
  json?: boolean;

  // 注释
  comment?: string;

  // 关联类型
  keytype?: clazz_type;
  valtype?: clazz_type;
}

const FP_KEY = "__fieldproto";

function CloneFps(fps: IndexedObject): IndexedObject {
  let r: IndexedObject = {};
  for (let k in fps) {
    r[k] = LightClone(fps[k]);
  }
  return r;
}

function LightClone(tgt: any): any {
  let r: IndexedObject = {};
  for (let k in tgt) {
    r[k] = tgt[k];
  }
  return r;
}

function DefineFp(target: any, key: string, fp: FieldOption) {
  let fps: IndexedObject;
  if (target.hasOwnProperty(FP_KEY)) {
    fps = target[FP_KEY];
  }
  else {
    if (FP_KEY in target) {
      fps = CloneFps(target[FP_KEY]);
      for (let k in fps) {
        let fp: FieldOption = fps[k];
        fp.id *= 100;
      }
    }
    else {
      fps = {};
    }
    Object.defineProperty(target, FP_KEY, {
      enumerable: false,
      get: () => {
        return fps;
      }
    });
  }
  fps[key] = fp;
  Object.defineProperty(target, key, {
    value: fp.val,
    writable: true
  });
  // 生成get/set方法，便于客户端连写
  let proto = target.constructor.prototype;
  let nm = StringT.UpcaseFirst(key);
  proto["get" + nm] = function () {
    return this[key];
  };
  proto["set" + nm] = function (val: any) {
    this[key] = val;
    return this;
  };
}

// 从base中copy
const string_t = "string";
const integer_t = "integer";
const double_t = "double";
const boolean_t = "boolean";

function toBoolean(v: any): boolean {
  if (v == "true")
    return true;
  else if (v == "false")
    return false;
  return !!v;
}

// 填数据
function Decode(mdl: any, params: any) {
  let fps = mdl[FP_KEY];
  if (!fps)
    return;
  for (let key in params) {
    let fp: FieldOption = fps[key];
    if (fp == null) // 注意这边和core/proto有些不同，不去判断input的类型
      continue;
    let val = params[key];
    if (fp.valtype) {
      if (fp.array) {
        let arr = new Array();
        if (val) {
          if (typeof(fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              val.forEach(e => {
                arr.push(e ? e.toString() : null);
              });
            }
            else if (fp.valtype == integer_t) {
              val.forEach(e => {
                arr.push(e ? toInt(e) : 0);
              });
            }
            else if (fp.valtype == double_t) {
              val.forEach(e => {
                arr.push(e ? toFloat(e) : 0);
              });
            }
            else if (fp.valtype == boolean_t) {
              val.forEach(e => {
                arr.push(!!e);
              });
            }
          }
          else {
            if (fp.valtype == Object) {
              val.forEach(e => {
                arr.push(e);
              });
            }
            else {
              let clz: any = fp.valtype;
              val.forEach(e => {
                if (e == null) {
                  arr.push(null);
                }
                else {
                  let t = new clz();
                  Decode(t, e);
                  arr.push(t);
                }
              });
            }
          }
        }
        mdl[key] = arr;
      }
      else if (fp.map) {
        let keyconv = (v: any) => {
          return v
        };
        if (fp.keytype == integer_t)
          keyconv = toInt;
        else if (fp.keytype == double_t)
          keyconv = toFloat;
        let map = new CMap();
        if (val) {
          if (typeof(fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), ev ? ev.toString() : null);
              }
            }
            else if (fp.valtype == integer_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), ev ? toInt(ev) : 0);
              }
            }
            else if (fp.valtype == double_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), ev ? toFloat(ev) : 0);
              }
            }
            else if (fp.valtype == boolean_t)
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), !!ev);
              }
          }
          else {
            let clz: any = fp.valtype;
            for (let ek in val) {
              let ev = val[ek];
              if (ev == null) {
                map.set(keyconv(ek), null);
              }
              else {
                let t = new clz();
                Decode(t, ev);
                map.set(keyconv(ek), t);
              }
            }
          }
        }
        mdl[key] = map;
      }
      else if (fp.multimap) {
        let keyconv = (v: any) => {
          return v
        };
        if (fp.keytype == integer_t)
          keyconv = toInt;
        else if (fp.keytype == double_t)
          keyconv = toFloat;
        let mmap = new MultiMap();
        if (val) {
          if (typeof(fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => asString(e)));
              }
            }
            else if (fp.valtype == integer_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => toInt(e)));
              }
            }
            else if (fp.valtype == double_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => toFloat(e)));
              }
            }
            else if (fp.valtype == boolean_t)
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => !!e));
              }
          }
          else {
            let clz: any = fp.valtype;
            for (let ek in val) {
              let ev = val[ek];
              mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => {
                let t = new clz();
                Decode(t, e);
                return t;
              }));
            }
          }
        }
        mdl[key] = mmap;
      }
      else if (fp.enum) {
        mdl[key] = val ? parseInt(val) : 0;
      }
      else if (fp.valtype == Object) {
        mdl[key] = val;
      }
      else if (val) {
        let clz: any = fp.valtype;
        let t = new clz();
        Decode(t, val);
        mdl[key] = t;
      }
    }
    else {
      if (fp.string)
        mdl[key] = val ? val.toString() : null;
      else if (fp.integer)
        mdl[key] = val ? toInt(val) : 0;
      else if (fp.double)
        mdl[key] = val ? toFloat(val) : 0;
      else if (fp.boolean)
        mdl[key] = toBoolean(val);
      else if (fp.json)
        mdl[key] = val;
      else if (fp.file)
        mdl[key] = val;
    }
  }
  // 处理内置参数
  if ("_mid" in params)
    mdl["_mid"] = params["_mid"];
}

// 把所有input的数据拿出来
function Encode(mdl: any): any {
  let fps = mdl[FP_KEY];
  if (fps == null)
    return null;
  let r: IndexedObject = {};
  for (let key in fps) {
    let fp: FieldOption = fps[key];
    if (!fp.input || !mdl.hasOwnProperty(key))
      continue;
    let v = mdl[key];
    if (v == null)
      continue;
    // 如果是对象，则需要在encode一次
    if (fp.valtype && !fp.enum && typeof fp.valtype != "string")
      r[key] = JSON.stringify(Encode(v));
    else
      r[key] = v;
  }
  return r;
}

// 收集model的输出
function Output(mdl: any): any {
  if (!mdl)
    return {};
  let fps = mdl[FP_KEY];
  let r: IndexedObject = {};
  for (let fk in fps) {
    let fp: FieldOption = fps[fk];
    if (!fp.output)
      continue;
    let val = mdl[fk];
    if (fp.valtype) {
      if (fp.array) {
        // 通用类型，则直接可以输出
        if (typeof(fp.valtype) == "string") {
          r[fk] = val;
        }
        else {
          // 特殊类型，需要迭代进去
          let arr = new Array();
          val && val.forEach(e => {
            arr.push(Output(e));
          });
          r[fk] = arr;
        }
      }
      else if (fp.map) {
        let m: IndexedObject = {};
        if (val) {
          if (typeof(fp.valtype) == "string") {
            val.forEach((v, k) => {
              m[k] = v;
            });
          }
          else {
            val.forEach((v, k) => {
              m[k] = Output(v);
            });
          }
        }
        r[fk] = m;
      }
      else if (fp.multimap) {
        let m: IndexedObject = {};
        if (val) {
          if (typeof(fp.valtype) == "string") {
            val.forEach((v, k) => {
              m[k] = v;
            });
          }
          else {
            val.forEach((v, k) => {
              m[k] = ArrayT.Convert(v, e => Output(e));
            });
          }
        }
        r[fk] = m;
      }
      else if (fp.valtype == Object) {
        r[fk] = val;
      }
      else {
        r[fk] = Output(val);
      }
    }
    else {
      r[fk] = val;
    }
  }
  return r;
}

