import {Model} from "./model-impl";

namespace models {






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

}

namespace routers {

    export let SampleEcho = ["sample.echo", models.Echoo, ""];

    export let SampleLogin = ["sample.login", models.Login, ""];

    export let SampleUser = ["sample.user", models.User, ""];

    export let SampleMessage = ["sample.message", models.Message, "监听消息炸弹"];

    export let SampleUpload = ["sample.upload", models.Upload, "上传图片"];

}

namespace api {

    export function SampleEcho():models.Echoo {
    return Model.NewRequest(routers.SampleEcho);
    }

    export function SampleLogin():models.Login {
    return Model.NewRequest(routers.SampleLogin);
    }

    export function SampleUser():models.User {
    return Model.NewRequest(routers.SampleUser);
    }

    export function SampleMessage():models.Message {
    return Model.NewRequest(routers.SampleMessage);
    }

    export function SampleUpload():models.Upload {
    return Model.NewRequest(routers.SampleUpload);
    }

}

