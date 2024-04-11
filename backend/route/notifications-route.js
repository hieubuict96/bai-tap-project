import express from "express";
import { getNotifications } from "../controller/notifications-controller.js";
import { requireSignin } from "../common/user.js";
const router = express.Router();

router.get("/get-notifications", requireSignin, getNotifications);

export default router;
