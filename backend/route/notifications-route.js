import express from "express";
import { getNotifications, markReadNotification } from "../controller/notifications-controller.js";
import { requireSignin } from "../common/user.js";
const router = express.Router();

router.get("/get-notifications", requireSignin, getNotifications);
router.post("/mark-read-notification", requireSignin, markReadNotification);

export default router;
