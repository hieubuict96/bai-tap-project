import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import userRouter from "./route/user-route.js";
import chatRouter from "./route/chat-route.js";
import postRouter from "./route/post-route.js";
import { createSocket } from "./socket/socket.js";
import { Server } from "socket.io";
import { PORT } from "../env.js";

dotenv.config();
const app = express();
const PORT1 = PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const httpServer = http.Server(app);
createSocket(
  new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } })
);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/post", postRouter);

httpServer.listen(PORT1, () => {
  console.log(`Server is running on port ${PORT1}`);
});
