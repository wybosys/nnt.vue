import {Base} from "../nnt/Logic";
import {config} from "../nnt/Config";

export class Model extends Base {

  constructor() {
    super();
    this.host = config.get('HOST');
  }

  iscross(): boolean {
    return false;
  }

  domain: string;

  url(): string {
    return this.host + "?action=" + this.action;
  }
}
