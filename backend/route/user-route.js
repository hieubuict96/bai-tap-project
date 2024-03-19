import express from "express";
const router = express.Router();
import {
  signup,
  update,
  signin,
  getData,
  getChat,
  sendMsg,
  declineVideo
} from "../controller/user-controller.js";
import { requireSignin } from "../common/user.js";
import { upload } from "../common/multer.js";

router.post("/signup", upload.single('imgUrl'), signup);
router.post("/update", upload.single('imgUrl'), update);
router.post("/signin", signin);
router.get("/get-data", getData);
router.get("/get-chat", requireSignin, getChat);
router.post("/send-msg", requireSignin, sendMsg);
router.post("/decline-video", requireSignin, declineVideo);

export default router;
