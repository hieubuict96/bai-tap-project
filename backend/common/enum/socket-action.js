export const SocketAction = {
  SEND: 0, //Gửi
  ACCEPT_CALL: 1, //Chấp nhận call
  DECLINE_CALL: 2, //Chấp nhận call
  BUSY_CALL: 3, //Chấp nhận call
  OFF_CALL: 4, //Chấp nhận call
  NOT_RESPOND: 5, //Người dùng không phản hồi
  NOT_ONLINE: 6, //Người dùng không online
  GET_GROUP_AND_ACTIVE_USERS: 7,//Nhận info của các người trong group call
  JOIN_CALL_GROUP: 8, //join vào group
  OFF_CALL_GROUP: 9 //Chấp nhận call
}
