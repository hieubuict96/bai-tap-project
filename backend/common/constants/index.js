export const ResponseSocketType = {
  COMMENT: 0, //Đại diện cho kiểu gửi về bình luận bài viết
}

export const SocketFn = {
  MSG: 0, //Gửi tin nhắn
  CALL: 1, //Gửi tin nhắn
  VIDEO_CALL: 2 //Gửi tin nhắn
}

export const SocketAction = {
  SEND: 0, //Gửi
  ACCEPT_CALL: 1, //Chấp nhận call
  DECLINE_CALL: 2, //Chấp nhận call
  BUSY_CALL: 3, //Chấp nhận call
  OFF_CALL: 4, //Chấp nhận call
  NOT_RESPOND: 5, //Người dùng không phản hồi
  NOT_ONLINE: 6, //Người dùng không online
}
