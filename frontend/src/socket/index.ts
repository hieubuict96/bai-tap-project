import { io } from "socket.io-client";
import { DOMAIN_BACKEND } from "../common/const";
import { SocketResponse } from "../models/socket-response";

let socket: any;

export function connectSocket(id: any, cb: any) {
  socket = io(DOMAIN_BACKEND);
  socket.emit("subscribe", {
    id,
  });

  socket.on(`${id}`, (data: SocketResponse) => {
    cb(data);
  });
}

export function unsubscribe(username: any) {
  socket.emit("unsubscribe", { username });
}

export function call(user: any, otherUser: any, is2Person: boolean, signal: any) {
  socket.emit(`call`, {
    user,
    otherUser,
    is2Person,
    signal,
  });
}

export function videoCall(user: any, otherUser: any, is2Person: boolean, signal: any) {
  socket.emit(`videoCall`, {
    user,
    otherUser,
    is2Person,
    signal,
  });
}

export function emitAcceptCall(user: any, otherUser: any, is2Person: boolean, signal: any) {
  socket.emit('acceptCall', {
    user, otherUser, signal, is2Person
  });
}

export function emitDeclineCall(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('declineCall', {
    user, otherUser, is2Person
  });
}

export function notRespond(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('notRespond', {
    user, otherUser, is2Person
  });
}

export function offCall(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('offCall', {
    user, otherUser, is2Person
  });
}

export function emitJoinRoom(user: any, groupId: any, isVideoCall: boolean) {
  socket.emit('joinRoom', {
    user, groupId, isVideoCall
  });

  // socket.on("userConnected", (userId: string) => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("newUser", { userId, signal });
  //   });

  //   peer.on("stream", (stream) => {
  //     addVideoStream(createRemoteVideoElement(userId), stream, false);
  //   });

  //   socket.on("signal", (data) => {
  //     if (data.userId === userId) {
  //       peer.signal(data.signal);
  //     }
  //   });

  //   setPeers((prevPeers) => [...prevPeers, peer]);
  // });

  // socket.on("userDisconnected", (userId: string) => {
  //   removePeer(userId);
  // });
}

export function emitBusyCall(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('busyCall', {
    user, otherUser, is2Person
  });
}
