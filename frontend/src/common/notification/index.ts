import { NotificationType } from "../enum/notification-type";

export const openNotification = (api: any, type: NotificationType, title: string, desc: string) => {
  api[type]({
    message: title,
    description: desc,
    placement: 'bottomRight',
  });
};
