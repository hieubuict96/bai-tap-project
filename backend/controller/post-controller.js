import { formatDateToSQL, getNotificationContent, getResponseSocket1, getUserLoggedIn, insertAndQuery } from "../common/common-function.js";
import { ResponseSocketType } from "../common/constants/index.js";
import connect from "../db.js";
import { sendNotification } from "../socket/socket.js";

const connection = await connect();

export async function getPost(req, res) {
  const { id } = req.query;

  const sql1 = `select
	p.id pId,
	p.content,
	p.created_time pCreatedTime,
	ip.img_url imgUrl,
	u.*
from
	posts p
left join imgs_post ip on
	p.id = ip.post_id
inner join users u on
	p.user_id = u.id
where
	p.id = '${id}'`;
  const query1 = await connection.query(sql1);

  const post = {};
  post.imgs = [];
  if (query1[0].length > 0) {
    post.pId = query1[0][0].pId;
    post.content = query1[0][0].content;
    post.pCreatedTime = query1[0][0].pCreatedTime;
    post.id = query1[0][0].id;
    post.imgUrl = query1[0][0].img_url;
    post.fullName = query1[0][0].full_name;
  }
  query1[0].forEach(e => {
    if (e.imgUrl) {
      post.imgs.push(e.imgUrl);
    }
  });

  const sql2 = `select
	c.content cContent,
	c.created_time,
  c.id cId,
	u.id userId,
	u.full_name,
	u.img_url
from
	posts p
inner join comments c on
	p.id = c.post_id
inner join users u on
	c.user_id = u.id
where
	p.id = '${id}'
order by
	c.created_time desc`;
  const query2 = await connection.query(sql2);
  return res.status(200).json({
    post,
    comments: query2[0]
  });
}

export async function addComment(req, res) {
  const { id, comment } = req.body;
  const userComment = getUserLoggedIn(req);
  let sql = `insert into comments values (null, '${id}', '${userComment.id}', '${comment}', '${formatDateToSQL(new Date())}')`;
  const dataCmt = await insertAndQuery(sql, 'comments', connection);

  sql = `select u.* from users u inner join posts p on u.id = p.user_id where p.id = '${id}' group by u.id`;
  const data = await connection.query(sql);
  const user = data[0][0];
  sql = `insert into notifications (user_id_to, notification_type, content, open, link_id, img_url, ref_id) values ('${user.id}', 0, '${getNotificationContent(0, [userComment.fullName])}', 0, '${id}', '${userComment.imgUrl}', '${dataCmt.id}')`;
  const dataNoti = await insertAndQuery(sql, 'notifications', connection);
  dataNoti.postId = id;
  sendNotification(user.username, getResponseSocket1(ResponseSocketType.COMMENT, {
    userComment, dataNoti
  }));
  res.status(200).json({});
}

export async function addPost(req, res) {
  const { content } = req.body;
  const userId = getUserLoggedIn(req).id;
  let sql = `insert
	into
	posts (user_id, content)
values ('${userId}',
'${content}')`;
  const data = await insertAndQuery(sql, 'posts', connection);
  if (req.files?.length > 0) {
    sql = `insert into imgs_post values (null, '${req.files[0].filename}', '${data.id}')`;

    req.files.forEach((e, k) => {
      if (k > 1) {
        sql += `, (null, '${e.filename}', '${data.id}')`;
      }
    });

    const response = await connection.execute(sql);
  }
  res.status(200).json({ data });
}
