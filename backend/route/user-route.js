import express from "express";
const router = express.Router();
import {
  signup,
  update,
  signin,
  getData,
  searchUser,
  userProfile,
  getFriends
} from "../controller/user-controller.js";
import { upload } from "../common/multer.js";
import { requireSignin } from "../common/user.js";

router.post("/signup", upload.single('imgUrl'), signup);
router.post("/update", upload.single('imgUrl'), requireSignin, update);
router.post("/signin", signin);
router.get("/get-data", getData);
router.post("/search", searchUser);
router.get("/user-profile", userProfile);
router.get("/get-friends", requireSignin, getFriends);

export default router;
