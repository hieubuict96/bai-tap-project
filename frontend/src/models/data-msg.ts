export class DataMsg {
  is2Person: boolean;
  msg: string;
  userIdFrom: number;

  constructor(is2Person: boolean, msg: string, userIdFrom: number) {
    this.is2Person = is2Person;
    this.msg = msg;
    this.userIdFrom = userIdFrom;
  }
}
