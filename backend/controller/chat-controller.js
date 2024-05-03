import connect from "../db.js";
import { decline, sendMessage } from "../socket/socket.js";
import { StatusVideo } from '../common/enum/status-video.js'
import { getIdLoggedIn, getUserLoggedIn, insertAndGetId } from "../common/common-function.js";

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
		gm.group_receive = gc.id) tbl
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
	gc.id = gm.group_receive
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
	tbl.id,
	tbl.is_2_person is2Person,
	tbl.img_url imgUrl,
	if (tbl.is_2_person = 1,
	(
	select
		u.id
	from
		members_of_group mog
	inner join users u on
		mog.user_id = u.id
	where
		tbl.id = mog.group_id
		and mog.user_id <> ${id}),
		tbl.id) otherUser,
	if (tbl.is_2_person = 1,
	(
	select
		u.full_name
	from
		members_of_group mog
	inner join users u on
		mog.user_id = u.id
	where
		tbl.id = mog.group_id
		and mog.user_id <> ${id}),
		tbl.name) gcName,
	if (tbl.is_2_person = 1,
	if (gm.user_from = ${id},
	'Bạn',
	null),
	if (gm.user_from = ${id},
	'Bạn',
	(
	select
		full_name
	from
		users u
	where
		u.id = gm.user_from))) personFinalChat,
	gm.msg
from
	(
	select
		gc.*,
		max(gm.created_time) gmCreatedTime
	from
		group_chat gc
	inner join members_of_group mog on
		gc.id = mog.group_id
	left join group_msg gm on
		gc.id = gm.group_receive
	where
		mog.user_id = ${id}
	group by
		gc.id) tbl
left join group_msg gm on
	tbl.id = gm.group_receive
	and
	tbl.gmCreatedTime = gm.created_time
group by
	tbl.id
order by
	gm.created_time desc`;
	const dataMsg = await connection.query(query);
	dataMsg[0].forEach(e => {
		e.is2Person = e.is2Person.readUInt8(0);
	});
	return res.status(200).json({ msgList: dataMsg[0] });
}

export async function sendMsg(req, res) {
	const { otherUser, text } = req.body;
	const user = getUserLoggedIn(req).username;

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
username = '${user}'),
(
select
	id
from
	users
where
username = '${otherUser}'),
'${text}', default)`);

	sendMessage(user, otherUser, {
		msg: text,
		isSend: false
	});
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
