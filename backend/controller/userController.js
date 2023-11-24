import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "../db.js";
import { signToken } from "../common-middleware/user.js";
import { decline, sendMessage } from "../socket/socket.js";
import { JWT_SECRET } from "../../env.js";

const connection = await connect();

export async function signup(req, res) {
  const { phone, password } = req.body;
  const data = await getDataSQL(
    `select id from users where phone = '${phone}'`
  );

  if (data[0].length > 0) {
    return res.status(400).json({
      code: "phoneExists",
    });
  } else {
    const hashPassword = bcryptjs.hashSync(password, 10);
    await exeSQL(
      `insert into users values (null, '${phone}', '${hashPassword}')`
    );
    const data = await getDataSQL(
      `select * from users where phone = '${phone}'`
    );

    const token = signToken(phone);

    return res.status(200).json({
      user: {
        id: data[0][0].id,
        phone: data[0][0].phone,
      },
      token,
    });
  }
}

export async function signin(req, res) {
  const { phone, password } = req.body;
  const data = await getDataSQL(`select * from users where phone = '${phone}'`);
  if (
    data[0].length === 0 ||
    !bcryptjs.compareSync(password, data[0][0].password)
  ) {
    return res.status(400).json({ code: "signinFail" });
  }

  const token = signToken(phone);

  return res.status(200).json({
    user: {
      id: data[0][0].id,
      phone: data[0][0].phone,
    },
    token,
  });
}

export async function getData(req, res) {
  if (!req.headers.authorization) {
    return res.status(400).json({ code: "verifyFail" });
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const phone = jwt.verify(accessToken, JWT_SECRET).username;
    const data = await getDataSQL(
      `select * from users where phone = '${phone}'`
    );
    if (data[0].length === 0) {
      return res.status(400).json({ code: "verifyFail" });
    }

    return res.status(200).json({
      user: {
        id: data[0][0].id,
        phone: data[0][0].phone,
      },
    });
  } catch (error) {
    return res.status(400).json({ code: "verifyFail" });
  }
}

export async function getChat(req, res) {
  const { user, otherUser } = req.query;
  const data = await getDataSQL(
    `select id, phone from users where phone = '${user}' or phone = '${otherUser}'`
  );

  let idSend;
  let idReceive;

  data[0].forEach((e) => {
    if (e.phone == user) {
      idSend = e.id;
    }

    if (e.phone == otherUser) {
      idReceive = e.id;
    }
  });

  if (!idReceive) {
    return res.status(400).json({ code: "otherUserNotFound" });
  }

  const dataMsg = await getDataSQL(`select
  msg,
  if (u1.id = m.user_from,
  1,
  0) isSend
from
  users u1
inner join users u2
inner join msg m on
  (u1.id = m.user_from
    and u2.id = m.user_receive)
  or (u1.id = m.user_receive
    and u2.id = m.user_from)
where
  u1.id = '${idSend}'
  and u2.id = '${idReceive}'`);
  return res.status(200).json({ msgList: dataMsg[0] });
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
'${text}')`);

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
    code: 'DECLINE_VIDEO'
  };

  decline(otherUser, data);
}

async function getDataSQL(sql) {
  return await connection.execute(sql);
}

async function exeSQL(sql) {
  await connection.execute(sql);
}
