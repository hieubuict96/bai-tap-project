export class DataMsgGroup {
  createdTime: Date;
  email: string;
  fullName: string;
  id: number;
  imgUrl: string | null;
  is2Person: boolean;
  msg: string;
  otherUser: number;
  userIdFrom: number;
  username: string;

  constructor(createdTime: Date,
    email: string,
    fullName: string,
    id: number,
    imgUrl: string | null,
    is2Person: boolean,
    msg: string,
    otherUser: number,
    userIdFrom: number,
    username: string) {
    this.createdTime = createdTime;
    this.email = email;
    this.fullName = fullName;
    this.id = id;
    this.imgUrl = imgUrl;
    this.is2Person = is2Person;
    this.msg = msg;
    this.otherUser = otherUser;
    this.userIdFrom = userIdFrom;
    this.username = username;
  }
}
