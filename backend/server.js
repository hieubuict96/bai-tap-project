import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import userRouter from "./route/user-route.js";
import { createSocket } from "./socket/socket.js";
import { Server } from "socket.io";
import { PORT } from "../env.js";

dotenv.config();
const app = express();
const PORT1 = PORT || 8000;
app.use(cors());
app.use(express.json());
const httpServer = http.Server(app);
createSocket(
  new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } })
);
app.use("/api/user", userRouter);

httpServer.listen(PORT1, () => {
  console.log(`Server is running on port ${PORT1}`);
});
