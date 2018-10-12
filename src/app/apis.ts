import {Model} from "./model-impl";






export class Echoo extends Model {
  
      @Model.string(1, [Model.input], "输入")
      input:string;
  
      @Model.string(2, [Model.output], "输出")
      output:string;
  
      @Model.integer(3, [Model.output], "服务器时间")
      time:number;
  
      @Model.json(4, [Model.output])
      json:Object;
  
      @Model.map(5, Model.string_t, Model.integer_t, [Model.output])
      map:Map<string, number>;
  
      @Model.array(6, Model.double_t, [Model.output])
      array:Array<number>;
  
}

export class Login extends Model {
  
      @Model.string(1, [Model.input], "随便输入一个用户id")
      uid:string;
  
      @Model.string(2, [Model.output])
      sid:string;
  
}

export class User extends Model {
  
      @Model.string(1, [Model.output], "当前用户id")
      uid:string;
  
}

export class Message extends Model {
  
      @Model.string(1, [Model.output], "消息体")
      content:string;
  
}

export class Upload extends Model {
  
      @Model.file(1, [Model.input, Model.output], "选择一个图片")
      file:any;
  
}



export let RSampleEcho = ["sample.echo", Echoo, ""];

export let RSampleLogin = ["sample.login", Login, ""];

export let RSampleUser = ["sample.user", User, ""];

export let RSampleMessage = ["sample.message", Message, "监听消息炸弹"];

export let RSampleUpload = ["sample.upload", Upload, "上传图片"];



export function SampleEcho():Echoo {
  return Model.NewRequest(RSampleEcho);
}

export function SampleLogin():Login {
  return Model.NewRequest(RSampleLogin);
}

export function SampleUser():User {
  return Model.NewRequest(RSampleUser);
}

export function SampleMessage():Message {
  return Model.NewRequest(RSampleMessage);
}

export function SampleUpload():Upload {
  return Model.NewRequest(RSampleUpload);
}

