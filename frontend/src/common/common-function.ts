import { notification } from "antd";
import { DOMAIN_IMG, IMG_NULL } from "./const";

export function formatDateUtil(dateTimeStr: any) {
  const dateTime = new Date(dateTimeStr);
  let date = (dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()) + '/' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) + '/' + dateTime.getFullYear();
  return date;
}

export function formatTimeUtil(dateTimeStr: any) {
  const dateTime = new Date(dateTimeStr);
  let time = (dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()) + ':' + (dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()) + ':' + (dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds());
  return time;
}

export function showNotification(type: any, title: any, message: any, cb?: any) {
  notification.open({
    type,
    placement: 'bottomRight',
    message: title,
    description: message,
    onClick: () => {
      if (cb) {
        cb();
      }
    },
  });
}

export function enterExe(e: any, exe: any) {
  if (e.key === "Enter") {
    exe();
  }
}

export function getImgUrl(rawUrl: any) {
  return rawUrl ? DOMAIN_IMG + rawUrl : IMG_NULL;
}