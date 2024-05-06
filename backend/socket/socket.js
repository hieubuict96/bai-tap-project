import { StatusVideo } from '../common/enum/status-video.js'

let io;
const usersConnected = new Set();

export function createSocket(ioHttp) {
  io = ioHttp;
  io.on("connection", (socket) => {
    socket.on("subscribe", ({ id }) => {
      usersConnected.add(id);
    });

    socket.on("unsubscribe", ({ id }) => {
      usersConnected.delete(id);
    });

    socket.on("callVideo", ({ user, otherUser, signal }) => {
      io.emit(`subscribeGlobal/${otherUser}`, {
        otherUser: user,
        signal,
        code: StatusVideo.CONNECT_VIDEO
      });
    });

    socket.on('acceptVideo', ({ user, otherUser, signal }) => {
      io.emit(`videoAccepted/${user}/${otherUser}`, signal);
    });
  });
}

export function sendMessage(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`${otherUser}`, data);
  }
}

export function call(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`subscribeGlobal/${otherUser}`, data);
  }
}

export function decline(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`subscribeGlobal/${otherUser}`, data);
  }
}

export function sendNotification(otherUser, data) {
  if (usersConnected.has(otherUser)) {
    io.emit(`subscribeGlobal/${otherUser}`, data);
  }
}
