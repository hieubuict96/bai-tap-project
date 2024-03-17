import { io } from "socket.io-client";
import { DOMAIN_BACKEND } from "../common/const";

let socket: any;

export function connectSocket(phone: any, cb: any) {
  socket = io(DOMAIN_BACKEND);
  socket.emit("subscribe", {
    phone,
  });

  socket.on(`subscribeGlobal/${phone}`, (data: any) => {
    cb(data.otherUser, data.code, data.signal);
  });
}

export function subscribeMsg(
  user: any,
  otherUser: any,
  callback: any
) {
  socket.on(`msg/${otherUser}/${user}`, (data: any) => {
    callback(data);
  });
}

export function unsubscribe(phone: any) {
  socket.emit("unsubscribe", { phone });
}

export function callVideo(user: any, otherUser: any, signal: any) {
  socket.emit(`callVideo`, {
    user,
    otherUser,
    signal,
  });
}

export function emitAcceptVideo(user: any, otherUser: any, signal: any) {
  socket.emit('acceptVideo', {
    user, otherUser, signal
  });
}

export function videoAccepted(user: any, otherUser: any, cb: any) {
  socket.on(`videoAccepted/${otherUser}/${user}`, (signal: any) => {
    cb(signal);
  });
}
