import { getUserLoggedIn } from "../common/common-function.js";
import connect from "../db.js";

const connection = await connect();

export async function getNotifications(req, res) {
  const userId = getUserLoggedIn(req).id;
  const sql = `select
  id,
	user_id_receive userIdReceive,
  notification_type notificationType,
  content,
  created_time createdTime,
  open,
  link_id linkId
from
	notifications
where
	user_id_receive = '${userId}' order by created_time desc`;

  const data = await connection.query(sql);
  return res.status(200).json(data[0]);
}