export enum SocketAction {
  SEND = 0, //Gửi
  ACCEPT_CALL = 1, //Chấp nhận call
  DECLINE_CALL = 2,
  BUSY_CALL = 3,
  OFF_CALL = 4, //Chấp nhận call
  NOT_RESPOND = 5, //Người dùng không phản hồi
  NOT_ONLINE = 6, //Người dùng không online
}
