import express from "express";
const router = express.Router();
import {
  addComment,
  getPost
} from "../controller/post-controller.js";
import { requireSignin } from "../common/user.js";

router.get("/get-post", getPost);
router.post("/add-comment", requireSignin, addComment);

export default router;
