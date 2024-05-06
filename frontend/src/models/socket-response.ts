export class SocketResponse {
  fn: number;
  action: number;
  data: any | null;

  constructor(fn: number, action: number, data: any) {
    this.fn = fn;
    this.action = action;
    this.data = data;
  }
}
