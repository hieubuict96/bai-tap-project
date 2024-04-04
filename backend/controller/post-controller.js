import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "../db.js";
import { signToken } from "../common/user.js";
import { JWT_SECRET } from "../../env.js";

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
    post.imgs.push(e.imgUrl);
  });

  const sql2 = `select
	c.content cContent,
	c.created_time,
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
