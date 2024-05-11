import { DataCall } from "./data-call";
import { DataMsg } from "./data-msg";
import { DataMsgGroup } from "./data-msg-group";

export class SocketResponse {
  fn: number;
  action: number;
  data: DataCall | DataMsg | DataMsgGroup;

  constructor(fn: number, action: number, data: DataCall | DataMsg) {
    this.fn = fn;
    this.action = action;
    this.data = data;
  }
}
