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

export function offCall(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('offCall', {
    user, otherUser, is2Person
  });
}

export function emitBusyCall(user: any, otherUser: any, is2Person: boolean) {
  socket.emit('busyCall', {
    user, otherUser, is2Person
  });
}
