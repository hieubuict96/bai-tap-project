import connect from "../db.js";
import { sendMessage } from "../socket/socket.js";
import { getIdLoggedIn, getResponseSocket, getUserLoggedIn, insertAndGetId } from "../common/common-function.js";
import { SocketFn } from "../common/enum/socket-fn.js";
import { SocketAction } from "../common/enum/socket-action.js";

const connection = await connect();

export async function getChat(req, res) {
  let { otherUser, is2Person } = req.query;
  otherUser = parseInt(otherUser);
  is2Person = is2Person == 'true';
  const id = getIdLoggedIn(req);

  if (is2Person) {
    let sql;
    if (id < otherUser) {
      sql = `select
			id,
			msg,
			if (is_user0_send = 1, 1, 0) isSend,
			created_time createdTime
		from
			msg m
		where
			m.user0 = ${id}
			and m.user1 = ${otherUser}`;
    } else {
      sql = `select
			id,
			msg,
			1 - is_user0_send isSend,
			created_time createdTime
		from
			msg m
		where
			m.user0 = ${otherUser}
			and m.user1 = ${id}`;
    }

    const msgList = (await connection.query(sql))[0];
    msgList.forEach(e => {
      e.isSend = e.isSend == 1;
    });
    return res.status(200).json({
      info: (await connection.query(`select id, username, email, img_url imgUrl, full_name fullName from users where id = ${otherUser}`))[0][0],
      msgList
    });
  }

  const sqlMsg = `select
	gm.id,
	if (gm.user_from = ${id},
	1,
	0) isSend,
	u.id userFromId,
	u.username userFromUsername,
	u.full_name userFromFullName,
	u.img_url userFromImgUrl,
	gm.msg,
	gm.created_time createdTime
from
	group_chat gc
left join group_msg gm on
	gc.id = gm.group_to
left join users u on
	gm.user_from = u.id
where
	gc.id = ${otherUser}`;

  const sqlInfo = `select
  gc.id,
  gc.user_id_admin userIdAdmin,
  gc.name,
  gc.img_url imgUrl,
  gc.created_time createdTime,
  json_arrayagg(
    json_object(
      'userId',
      u.id,
      'fullName',
      u.full_name,
      'imgUrl',
      u.img_url
    )
  ) users
from
  group_chat gc
  inner join members_of_group mog on gc.id = mog.group_id
  inner join users u on mog.user_id = u.id
where
  gc.id = ${otherUser}
group by
  gc.id`;
  const msgList = await connection.query(sqlMsg);
  const info = await connection.query(sqlInfo);
  return res.status(200).json({ msgList: msgList[0], info: info[0][0] });
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
  const { otherUser, text, is2Person } = req.body;
  const id = getUserLoggedIn(req).id;

  let sql;
  if (is2Person) {
    if (id < otherUser) {
      sql = `insert into msg values (null, '${id}', '${otherUser}', '${text}', 1, default)`;
    } else {
      sql = `insert into msg values (null, '${otherUser}', '${id}', '${text}', 0, default)`;
    }

    await exeSQL(sql);
    sendMessage(otherUser, getResponseSocket(SocketFn.MSG, SocketAction.SEND, {
      userIdFrom: id,
      msg: text,
      is2Person
    }));

    return res.status(200).json({ code: "sendSuccess" });
  }

  sql = `insert into group_msg values (null, ${id}, ${otherUser}, '${text}', default)`;
  await exeSQL(sql);
  const data = (await connection.query(`select id from users where id in (select user_id from members_of_group where group_id = ${otherUser})`))[0];

  data.forEach(e => {
    if (e.id != id) {
      sendMessage(e.id, getResponseSocket(SocketFn.MSG, SocketAction.SEND, {
        ...getUserLoggedIn(req),
        userIdFrom: id,
        msg: text,
        is2Person,
        otherUser
      }));
    }
  });
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
