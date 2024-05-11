export class DataOtherUser {
  id: number;
  fullName: string;
  imgUrl: string;
  username: string;

  constructor(id: any, username: string, fullName: string, imgUrl: string) {
    this.id = id;
    this.username = username;
    this.fullName = fullName;
    this.imgUrl = imgUrl;
  }
}
