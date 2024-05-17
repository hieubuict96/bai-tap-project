import express from "express";
const router = express.Router();
import {
  addComment,
  getPost,
  addPost,
  getPostsInHome
} from "../controller/post-controller.js";
import { requireSignin } from "../common/user.js";
import { upload } from "../common/multer.js";

router.get("/get-post", getPost);
router.post("/add-comment", requireSignin, addComment);
router.post("/add-post", upload.array('files'), requireSignin, addPost);
router.get("/get-posts-in-home", requireSignin, getPostsInHome);

export default router;
