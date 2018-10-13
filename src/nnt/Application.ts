import {Storage} from './Storage';
import {uuid} from "./Compat";

export let UNIQUEID: string;

function GenerateUniqueId(): string {
  return uuid(16, 16);
}

/** 应用的唯一标示 */
export function UniqueId(): string {
  if (UNIQUEID)
    return UNIQUEID;
  let id = Storage.shared.value("::n2::app::uid");
  if (id == null) {
    id = GenerateUniqueId();
    Storage.shared.set("::n2::app::uid", id);
    UNIQUEID = id;
  } else {
    UNIQUEID = id;
  }
  return UNIQUEID;
}


