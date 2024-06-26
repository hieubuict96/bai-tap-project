import { getResponseSocket } from '../common/common-function.js';
import { SocketAction } from '../common/enum/socket-action.js';
import { SocketFn } from '../common/enum/socket-fn.js';
import connect from "../db.js";
import { Server } from "socket.io";

let io;
const usersConnected = {};
const groupsCalling = {};
const connection = await connect();

export function createSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
  io.on("connection", (socket) => {
    socket.on("subscribe", ({ id }) => {
      usersConnected[id] = socket.id;
    });

    socket.on("unsubscribe", ({ id }) => {
      usersConnected[id] = undefined;
    });

    socket.on('getActiveUsers', async ({ user, otherUser }) => {
      const data = (await connection.query(`select
      gc.id,
      gc.name,
      gc.img_url imgUrl,
      json_arrayagg(
        json_object(
          'id',
          u.id,
          'fullName',
          u.full_name,
          'imgUrl',
          u.img_url
        )
      ) users
    from
      members_of_group mog
      inner join group_chat gc on mog.group_id = gc.id
      inner join users u on mog.user_id = u.id
    where
      gc.id = ${otherUser}
    group by
      gc.id`))[0][0];

      const activeUsers = [];
      data.users.forEach(e => {
        if (usersConnected[e.id]) {
          activeUsers.push(e.id);
        }
      });

      io.to(usersConnected[user]).emit(`${user}`, getResponseSocket(SocketFn.CALL, SocketAction.GET_GROUP_AND_ACTIVE_USERS, {
        activeUsers,
        dataGroup: data
      }));
    });

    socket.on("callGroup", async ({ user, otherUser, dataSend, dataGroup, allActiveUsersId }) => {
      for (let key in dataSend) {
        io.to(usersConnected[key]).emit(`${key}`, getResponseSocket(SocketFn.CALL, SocketAction.SEND, {
          dataGroup,
          userIdReq: user,
          signal: dataSend[key],
          allActiveUsersId,
          is2Person: false
        }));
      }
    });

    socket.on("callVideoGroup", async ({ user, otherUser, dataSend, dataGroup, allActiveUsersId }) => {
      for (let key in dataSend) {
        io.to(usersConnected[key]).emit(`${key}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.SEND, {
          dataGroup,
          userIdReq: user,
          signal: dataSend[key],
          allActiveUsersId,
          is2Person: false
        }));
      }
    });

    socket.on("joinGroup", async ({ user, otherUser, dataSend, dataGroup, allActiveUsersId }) => {
      for (let key in dataSend) {
        io.to(usersConnected[key]).emit(`${key}`, getResponseSocket(SocketFn.CALL, SocketAction.JOIN_CALL_GROUP, {
          dataGroup,
          userIdReq: user,
          signal: dataSend[key],
          allActiveUsersId,
          is2Person: false
        }));
      }
    });

    socket.on("call", async ({ user, otherUser, is2Person, signal }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.CALL, SocketAction.SEND, {
            userFrom: data,
            signal,
            is2Person
          }));
        } else {
          io.to(usersConnected[user]).emit(`${user}`, getResponseSocket(SocketFn.CALL, SocketAction.NOT_ONLINE, {
            is2Person
          }));
        }

        return;
      }
    });

    socket.on("videoCall", async ({ user, otherUser, is2Person, signal }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.SEND, {
            userFrom: data,
            signal,
            is2Person
          }));
        } else {
          io.to(usersConnected[user]).emit(`${user}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.NOT_ONLINE, {
            is2Person
          }));
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
        if (usersConnected[otherUser]) {
          const data = (await connection.query(`select
          id, username, img_url imgUrl, full_name fullName
        from
          users u
        where
          id = ${user}`))[0][0];

          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.ACCEPT_CALL, {
            userFrom: data,
            signal,
            is2Person
          }));
        }

        return;
      }

      const group = groupsCalling[otherUser];
      group.usersInCall.forEach(e => {
        io.to(usersConnected[e]).emit(`${e}`, getResponseSocket(SocketFn.CALL, SocketAction.ACCEPT_CALL, {
          is2Person,
          signal,
          user
        }));
      });

      io.to(usersConnected[user]).emit(`${user}`, getResponseSocket(SocketFn.CALL, SocketAction.GET_CALL_GROUP, {
        is2Person,
        signals: group
      }));

      group.usersInCall = [...group.usersInCall, user];
      group[user] = signal;
    });

    socket.on('declineCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.DECLINE_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('busyCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.BUSY_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('offCall', async ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.OFF_CALL, {
            user, otherUser, is2Person
          }));
        }
      }
    });

    socket.on('offCallGroup', async ({ user, activeUsersId, is2Person }) => {
      activeUsersId.forEach(e => {
        io.to(usersConnected[e]).emit(`${e}`, getResponseSocket(SocketFn.CALL, SocketAction.OFF_CALL_GROUP, {
          user, activeUsersId, is2Person
        }));
      });
    });

    socket.on('notRespond', ({ user, otherUser, is2Person }) => {
      if (is2Person) {
        if (usersConnected[otherUser]) {
          io.to(usersConnected[otherUser]).emit(`${otherUser}`, getResponseSocket(SocketFn.VIDEO_CALL, SocketAction.NOT_RESPOND, {
            is2Person
          }));
        }
      }
    });
  });
}

export function sendMessage(otherUser, data) {
  if (usersConnected[otherUser]) {
    io.to(usersConnected[otherUser]).emit(`${otherUser}`, data);
  }
}
export function sendNotification(otherUser, data) {
  if (usersConnected[otherUser]) {
    io.to(usersConnected[otherUser]).emit(`${otherUser}`, data);
  }
}
