type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (type: NotificationType, api: any, msg: string, desc: string) => {
  api[type]({
    message: msg,
    description: desc,
    placement: 'bottomRight',
  });
};
