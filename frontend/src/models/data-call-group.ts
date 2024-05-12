export class DataCallGroup {
  dataGroup: {
    id: number;
    name: string;
    imgUrl: string | null;
    users: {
      id: number;
      fullName: string;
      imgUrl: string | null;
    }[]
  };
  userIdReq: number;
  signal: any;
  is2Person: boolean;

  constructor(dataGroup: {
    id: number;
    name: string;
    imgUrl: string | null;
    users: {
      id: number;
      fullName: string;
      imgUrl: string | null;
    }[]
  }, userIdReq: number, signal: any, is2Person: boolean) {
    this.dataGroup = dataGroup;
    this.userIdReq = userIdReq;
    this.signal = signal;
    this.is2Person = is2Person;
  }
}
