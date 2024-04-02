import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env.js";

export function requireSignin(req, res, next) {
  const token = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")[1]
    : "";
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.query.user = user.username;
    next();
  } catch (error) {
    return res.status(400).json({ code: "verifyFail" });
  }
}

export function signToken(username) {
  return jwt.sign({ username: username }, JWT_SECRET, {
    expiresIn: "30d",
  });
}
