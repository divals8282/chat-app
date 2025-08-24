import httpServer from "node:http";
import express from "express";
import mongoose from "mongoose";
import { socket } from "./socket";
import { restApi } from "./rest-api";
import cors from "cors";
const application = express();
const server = httpServer.createServer(application);
application.use(express.json());
application.use(cors());
socket(server);
restApi(application);

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

server.listen(process.env.PORT, () => {
  console.log(`http server is running on port ${process.env.PORT}`);
});
