import { getResponseSocket } from '../common/common-function.js';
import { SocketAction } from '../common/enum/socket-action.js';
import { SocketFn } from '../common/enum/socket-fn.js';
import connect from "../db.js";

let io;
const usersConnected = new Set();
const connection = await connect();

export function createSocket(ioHttp) {
  io = ioHttp;
  io.on("connection", (socket) => {
    socket.on("subscribe", ({ id }) => {
      usersConnected.add(id);
    });

    socket.on("unsubscribe", ({ id }) => {
      usersConnected.delete(id);
    });

    socket.on("call", async ({ user, otherUser, is2Person, signal }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.emit(`${otherUser}`, getResponseSocket(SocketFn.CALL, SocketAction.SEND, {
            userFrom: data,
            signal,
            is2Person
          }));
        } else {
          io.emit(`${user}`, getResponseSocket(SocketFn.CALL, SocketAction.NOT_ONLINE));
        }
      }

      return;

      const data = (await connection.query(`select
        user_id userId
      from
        members_of_group mog
      where
        group_id = ${otherUser}`))[0];

      data.forEach(e => {
        io.emit(`${e}`, {
          otherUser: user,
          signal,
          code: StatusVideo.CONNECT_VIDEO
        });
      });
    });

    socket.on("videoCall", async ({ user, otherUser, is2Person, signal }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.SEND, {
            userFrom: data,
            signal,
            is2Person
          }));
        } else {
          io.emit(`${user}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.NOT_ONLINE));
        }
      }

      return;

      const data = (await connection.query(`select
        user_id userId
      from
        members_of_group mog
      where
        group_id = ${otherUser}`))[0];

      data.forEach(e => {
        io.emit(`${e}`, {
          otherUser: user,
          signal,
          code: StatusVideo.CONNECT_VIDEO
        });
      });
    });

    socket.on('acceptCall', async ({ user, otherUser, signal, is2Person }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.ACCEPT_CALL, {
            userFrom: data,
            signal,
            is2Person
          }));
        }
      }
    });

    socket.on('declineCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.DECLINE_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('busyCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.BUSY_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('offCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.OFF_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('notRespond', ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected.has(otherUser)) {
          io.emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.NOT_RESPOND));
        }
      }
    });
  });
}

export function sendMessage(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`${otherUser}`, data);
  }
}
export function sendNotification(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`${otherUser}`, data);
  }
}
