import connect from "../db.js";
import { decline, sendMessage } from "../socket/socket.js";
import { StatusVideo } from '../common/enum/status-video.js'

const connection = await connect();

export async function getChat(req, res) {
  const { user, otherUser, is2Person } = req.body;

  if (is2Person) {
    const query = 'select id, phone, email, img_url imgUrl, full_name fullName from users where id = ? or id = ?';
    const data = await connection.query(query, [user, otherUser]);

    let idSend = user;
    let idReceive = otherUser;
    let otherUserInfo;

    data[0].forEach((e) => {
      if (e.id == otherUser) {
        otherUserInfo = e;
      }
    });

    if (!idReceive) {
      return res.status(400).json({ code: "otherUserNotFound" });
    }

    const dataMsg = await connection.query(`select
	tbl.msg,
	if (tbl.userFrom = tbl.userId,
		1,
		0) isSend,
	tbl.createdTime
from
	(
	select
		gm.msg,
		gm.user_from userFrom,
		mog.user_id userId,
		gm.created_time createdTime
	from
		members_of_group mog
	inner join members_of_group mog2 on
		mog.group_id = mog2.group_id
		and mog.user_id = ?
		and mog2.user_id = ?
	inner join group_chat gc on
		mog.group_id = gc.id
		and gc.is_2_person = 1
	inner join group_msg gm on
		gm.group_receive = gc.id) tbl
order by
	tbl.createdTime desc`, [idSend, idReceive]);
    return res.status(200).json({ msgList: dataMsg[0], otherUser: otherUserInfo });
  }

  const dataMsg = await connection.query(`select
	u.full_name fullName,
	u.phone,
	gm.msg,
	gm.created_time createdTime,
	if (gm.user_from = ?,
	1,
	0) isSend
from
	group_chat gc
inner join group_msg gm on
	gc.id = gm.group_receive
inner join users u on 
	u.id = gm.user_from
where
	gc.id = ?
order by
	gm.created_time desc`, [user, otherUser]);

  const groupChat = await connection.query(`select id, name, user_id_admin userIdAdmin, img_url imgUrl from group_chat where id = ?`, [otherUser]);
  return res.status(200).json({ msgList: dataMsg[0], groupChat: groupChat[0] });
}



export async function getListChat(req, res) {
  const { user } = req.query;
  const query = `select
	gm.msg,
	u.full_name fullName,
	u.phone,
	if (u.id = ?,
	1,
	0) isSend,
	tbl.id,
	tbl.name,
	tbl.img_url imgUrl,
	tbl.is_2_person is2Person
from
	group_msg gm
inner join users u on
	u.id = gm.user_from
inner join (
	select
		gc.*,
		max(gm.id) gmId
	from
		members_of_group mog
	inner join group_chat gc on
		gc.id = mog.group_id
		and mog.user_id = ?
	inner join group_msg gm on
		gm.group_receive = gc.id
	group by
		gc.id) tbl on
	gm.id = tbl.gmId`;
  const dataMsg = await connection.query(query, [user, user]);
  return res.status(200).json({ msgList: dataMsg[0], groupChat: groupChat[0] });
}





export async function sendMsg(req, res) {
  const { otherUser, text } = req.body;
  const { user } = req.query;

  await exeSQL(`insert
	into
	msg
values (null,
(
select
	id
from
	users
where
	phone = '${user}'),
(
select
	id
from
	users
where
	phone = '${otherUser}'),
'${text}', default)`);

  sendMessage(user, otherUser, {
    msg: text,
    isSend: false
  });
  return res.status(200).json({ code: "sendSuccess" });
}

export async function declineVideo(req, res) {
  const { otherUser } = req.body;
  const { user } = req.query;
  const data = {
    otherUser: user,
    code: StatusVideo.DECLINE_VIDEO
  };

  decline(otherUser, data);
}

async function exeSQL(sql) {
  return await connection.execute(sql);
}
