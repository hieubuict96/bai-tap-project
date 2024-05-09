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

export function callVideo(user: any, otherUser: any, is2Person: boolean, signal: any) {
  socket.emit(`callVideo`, {
    user,
    otherUser,
    is2Person,
    signal,
  });
}

export function emitAcceptVideo(user: any, otherUser: any, is2Person: boolean, signal: any) {
  socket.emit('acceptVideo', {
    user, otherUser, signal, is2Person
  });
}

export function videoAccepted(user: any, cb: any) {
  socket.on(`${user}`, (data: any) => {
    cb(data);
  });
}
