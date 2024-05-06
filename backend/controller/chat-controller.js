import connect from "../db.js";
import { decline, sendMessage } from "../socket/socket.js";
import { StatusVideo } from '../common/enum/status-video.js'
import { getIdLoggedIn, getResponseSocket, getUserLoggedIn, insertAndGetId } from "../common/common-function.js";
import { SocketAction, SocketFn } from "../common/constants/index.js";

const connection = await connect();

export async function getChat(req, res) {
	let { otherUser, is2Person } = req.query;
	is2Person = is2Person == 'true';
	const id = getIdLoggedIn(req);

	if (is2Person) {
		const query = 'select id, username, email, img_url imgUrl, full_name fullName from users where id = ? or id = ?';
		const data = await connection.query(query, [id, otherUser]);

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
		gm.group_to = gc.id) tbl
order by
	tbl.createdTime desc`, [id, idReceive]);
		return res.status(200).json({ msgList: dataMsg[0], otherUser: otherUserInfo });
	}

	const dataMsg = await connection.query(`select
	u.full_name fullName,
	u.username,
	gm.msg,
	gm.created_time createdTime,
	if (gm.user_from = ?,
	1,
	0) isSend
from
	group_chat gc
inner join group_msg gm on
	gc.id = gm.group_to
inner join users u on 
	u.id = gm.user_from
where
	gc.id = ?
order by
	gm.created_time desc`, [id, otherUser]);

	const groupChat = await connection.query(`select id, name, user_id_admin userIdAdmin, img_url imgUrl from group_chat where id = ?`, [otherUser]);
	return res.status(200).json({ msgList: dataMsg[0], groupChat: groupChat[0] });
}

export async function getListChat(req, res) {
	const id = getUserLoggedIn(req).id;

	const query = `select
  *
from
  (
    select
      tbl.*,
      gm2.msg,
      if (gm2.user_from = '${id}', 1, 0) isSend,
      u.full_name fullNameSend
    from
      (
        select
          gc.id,
          gc.name,
          gc.img_url imgUrl,
          max(gm.created_time) gmCreatedTime
        from
          group_chat gc
          inner join members_of_group mog on gc.id = mog.group_id
          left join group_msg gm on gc.id = gm.group_to
        where
          mog.user_id = '${id}'
        group by
          gc.id
      ) tbl
      left join group_msg gm2 on tbl.gmCreatedTime = gm2.created_time
      and tbl.id = gm2.group_to
      inner join users u on gm2.user_from = u.id
    union
    all
    select
      if (m.user0 = '${id}', m.user1, m.user0) id,
      if (
        m.user0 = '${id}',
        (
          select
            u.full_name
          from
            users u
          where
            u.id = m.user1
        ),
        (
          select
            u.full_name
          from
            users u
          where
            u.id = m.user0
        )
      ) name,
      if (
        m.user0 = '${id}',
        (
          select
            u.img_url
          from
            users u
          where
            u.id = m.user1
        ),
        (
          select
            u.img_url
          from
            users u
          where
            u.id = m.user0
        )
      ) imgUrl,
      m.created_time gmCreatedTime,
      m.msg,
      if (
        m.user0 = '${id}'
        and m.is_user0_send = 1,
        1,
        0
      ) isSend,
      null fullNameSend
    from
      msg m
      inner join (
        select
          user0,
          user1,
          max(created_time) mCreatedTime
        from
          msg m
        where
          '${id}' in (user0, user1)
        group by
          user0,
          user1
      ) tbl on m.user0 = tbl.user0
      and m.user1 = tbl.user1
      and m.created_time = tbl.mCreatedTime
  ) tbl0
order by
  tbl0.gmCreatedTime desc`;
	const dataMsg = await connection.query(query);
	dataMsg[0].forEach((e) => {
		e.isSend = e.isSend == 1;
	});
	return res.status(200).json({ msgList: dataMsg[0] });
}

export async function sendMsg(req, res) {
	const { otherUser, text } = req.body;
	const id = getUserLoggedIn(req).id;

	let sql;
	if (id < otherUser) {
		sql = `insert into msg values (null, '${id}', '${otherUser}', '${text}', 1, default)`;
	} else {
		sql = `insert into msg values (null, '${otherUser}', '${id}', '${text}', 0, default)`;
	}

	await exeSQL(sql);

	sendMessage(otherUser, getResponseSocket(SocketFn.MSG, SocketAction.SEND, {
		userIdFrom: id,
		msg: text
	}));
	return res.status(200).json({ code: "sendSuccess" });
}

export async function declineVideo(req, res) {
	const { otherUser } = req.body;
	const user = getUserLoggedIn(req).username;
	const data = {
		otherUser: user,
		code: StatusVideo.DECLINE_VIDEO
	};

	decline(otherUser, data);
}

export async function createChat(req, res) {
	const {
		addedMembers,
		chatName
	} = req.body;
	const userId = getUserLoggedIn(req).id;

	let sql = `insert into group_chat values (null, '${chatName}', '${userId}', null, default, 0)`;
	const id = await insertAndGetId(sql, connection);
	let sql2 = `insert into members_of_group (user_id, group_id) values ('${userId}', '${id}')`;
	addedMembers.forEach((e) => {
		sql2 += `, ('${e.id}', '${id}')`;
	});

	await connection.execute(sql2);
	return res.status(200).json({ msg: 'Them moi nhom thanh cong' });
}

async function exeSQL(sql) {
	return await connection.execute(sql);
}
