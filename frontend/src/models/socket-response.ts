import { DataCall } from "./data-call";
import { DataCallGroup } from "./data-call-group";
import { DataMsg } from "./data-msg";
import { DataMsgGroup } from "./data-msg-group";

export class SocketResponse {
  fn: number;
  action: number;
  data: DataCall | DataMsg | DataMsgGroup | DataCallGroup | any;

  constructor(fn: number, action: number, data: DataCall | DataMsg) {
    this.fn = fn;
    this.action = action;
    this.data = data;
  }
}
