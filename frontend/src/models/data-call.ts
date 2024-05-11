import { DataOtherUser } from "./data-other-user";

export class DataCall {
  is2Person: boolean;
  signal: any;
  userFrom: DataOtherUser;

  constructor(is2Person: boolean, signal: any, userFrom: DataOtherUser) {
    this.is2Person = is2Person;
    this.signal = signal;
    this.userFrom = userFrom;
  }
}
