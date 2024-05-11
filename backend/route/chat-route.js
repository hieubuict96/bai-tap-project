import express from "express";
const router = express.Router();
import {
  getChat,
  sendMsg,
  getListChat,
  createChat
} from "../controller/chat-controller.js";
import { requireSignin } from "../common/user.js";

router.get("/get-chat", requireSignin, getChat);
router.get("/get-list-chat", requireSignin, getListChat);
router.post("/send-msg", requireSignin, sendMsg);
router.post("/create-chat", requireSignin, createChat);

export default router;
