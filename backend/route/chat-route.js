import express from "express";
const router = express.Router();
import {
  getChat,
  sendMsg,
  declineVideo,
  getListChat
} from "../controller/chat-controller.js";
import { requireSignin } from "../common/user.js";

router.post("/get-chat", getChat);
router.get("/get-list-chat", getListChat);
router.post("/send-msg", requireSignin, sendMsg);
router.post("/decline-video", requireSignin, declineVideo);

export default router;
