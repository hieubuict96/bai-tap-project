import { getUserLoggedIn } from "../common/common-function.js";
import connect from "../db.js";

const connection = await connect();

export async function getNotifications(req, res) {
  const userId = getUserLoggedIn(req).id;
  const sql = `select
  id,
	user_id_to userIdReceive,
  notification_type notificationType,
  content,
  created_time createdTime,
  open,
  link_id linkId,
  img_url imgUrl
from
	notifications
where
	user_id_to = '${userId}' order by created_time desc`;

  const data = await connection.query(sql);
  return res.status(200).json(data[0].map(e => {
    e.open = e.open[0];
    return e;
  }));
}

export async function markReadNotification(req, res) {
  const sql = `update
	notifications
set
	open = 1
where
	id = '${req.body.notificationId}'`;

  await connection.execute(sql);
  return res.status(204).json();
}
