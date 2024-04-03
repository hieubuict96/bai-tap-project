import express from "express";
const router = express.Router();
import {
  signup,
  update,
  signin,
  getData,
  searchUser,
  userProfile
} from "../controller/user-controller.js";
import { upload } from "../common/multer.js";

router.post("/signup", upload.single('imgUrl'), signup);
router.post("/update", upload.single('imgUrl'), update);
router.post("/signin", signin);
router.get("/get-data", getData);
router.post("/search", searchUser);
router.get("/user-profile", userProfile);

export default router;
