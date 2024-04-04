import express from "express";
const router = express.Router();
import {
  getPost
} from "../controller/post-controller.js";

router.get("/get-post", getPost);

export default router;
