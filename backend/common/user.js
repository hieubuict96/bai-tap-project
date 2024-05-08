import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env.js";
import createConnection from "../db.js";

const connection = await createConnection();

export async function requireSignin(req, res, next) {
  const token = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")[1]
    : "";
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const sql = `select id, username, email, img_url imgUrl, full_name fullName, created_time createdTime from users where username = '${user.username}'`;
    const response = await connection.query(sql);
    req.headers.userInfo = JSON.stringify(response[0][0]);
    next();
  } catch (error) {
    return res.status(400).json({ code: "verifyFail" });
  }
}

export function signToken(username) {
  return jwt.sign({ username }, JWT_SECRET, {
    expiresIn: "30d",
  });
}
