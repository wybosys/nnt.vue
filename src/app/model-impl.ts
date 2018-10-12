import {Base} from "../nnt/Logic";
import {config} from "../nnt/Config";

export class Model extends Base {

  constructor() {
    super();
    this.host = config.get('HOST');
    this.withCredentials = false;
  }

  iscross(): boolean {
    return false;
  }

  url(): string {
    return this.host + "?action=" + this.action;
  }
}
